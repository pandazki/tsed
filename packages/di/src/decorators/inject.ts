import {decoratorTypeOf, DecoratorTypes, isPromise, Metadata, Store, UnsupportedDecoratorType} from "@tsed/core";
import {DI_PARAM_OPTIONS, INJECTABLE_PROP} from "../constants/constants";
import type {InjectablePropertyOptions} from "../interfaces/InjectableProperties";
import {TokenProvider} from "../interfaces/TokenProvider";
import {getContext} from "../utils/asyncHookContext";

export function injectProperty(target: any, propertyKey: string, options: Partial<InjectablePropertyOptions>) {
  Store.from(target).merge(INJECTABLE_PROP, {
    [propertyKey]: {
      bindingType: DecoratorTypes.PROP,
      propertyKey,
      ...options
    }
  });
}

/**
 * Inject a provider to another provider.
 *
 * Use this decorator to inject a custom provider on constructor parameter or property.
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   @Inject(CONNECTION)
 *   connection: CONNECTION;
 * }
 * ```
 *
 * @param token A token provider or token provider group
 * @param onGet Use the given name method to inject
 * @returns {Function}
 * @decorator
 */
export function Inject(token?: TokenProvider | (() => TokenProvider), onGet = (bean: any) => bean): Function {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any | void => {
    const bindingType = decoratorTypeOf([target, propertyKey, descriptor]);

    switch (bindingType) {
      case DecoratorTypes.PARAM_CTOR:
        if (token) {
          const paramTypes = Metadata.getParamTypes(target, propertyKey);
          const type = paramTypes[descriptor as number];

          paramTypes[descriptor as number] = type === Array ? [token] : token;

          Metadata.setParamTypes(target, propertyKey, paramTypes);
        }
        break;

      case DecoratorTypes.PROP:
        injectProperty(target, propertyKey, {
          resolver(injector, locals, {options, ...invokeOptions}) {
            const originalType = Metadata.getType(target, propertyKey);
            locals.set(DI_PARAM_OPTIONS, {...options});

            if (originalType === Array) {
              let bean: any[] | undefined;

              if (!bean) {
                bean = injector.getMany(token, locals, invokeOptions);
                locals.delete(DI_PARAM_OPTIONS);
              }

              bean.forEach((instance: any, index) => {
                if (isPromise(bean)) {
                  instance.then((result: any) => {
                    bean![index] = result;
                  });
                }
              });

              return () => onGet(bean);
            }

            let bean: any;

            if (!bean) {
              const useType = token || Metadata.getType(target, propertyKey);
              bean = injector.invoke(useType, locals, invokeOptions);
              locals.delete(DI_PARAM_OPTIONS);
            }

            if (isPromise(bean)) {
              bean.then((result: any) => {
                bean = result;
              });
            }

            return () => onGet(bean);
          }
        });
        break;

      default:
        throw new UnsupportedDecoratorType(Inject, [target, propertyKey, descriptor]);
    }
  };
}

/**
 * Inject a context like PlatformContext or any BaseContext.
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   @InjectContext()
 *   ctx?: Context;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 */
export function InjectContext(): PropertyDecorator {
  return (target: any, propertyKey: string): any | void => {
    injectProperty(target, propertyKey, {
      resolver() {
        return () => getContext();
      }
    });
  };
}

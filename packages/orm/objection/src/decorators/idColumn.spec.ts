import {Store} from "@tsed/core";
import {IdColumn} from "@tsed/objection";
import {getJsonSchema} from "@tsed/schema";
import {Model} from "objection";

describe("@IdColumn", () => {
  it("should set metadata", () => {
    class MyModel extends Model {
      @IdColumn()
      id: number;
    }

    expect(getJsonSchema(MyModel)).toEqual({
      properties: {
        id: {
          type: "number"
        }
      },
      type: "object"
    });
    expect(Store.from(MyModel, "id").get("objection")).toEqual({
      columnType: "idColumn",
      options: {
        type: "increments"
      }
    });

    expect(MyModel.idColumn).toEqual("id");
  });
});

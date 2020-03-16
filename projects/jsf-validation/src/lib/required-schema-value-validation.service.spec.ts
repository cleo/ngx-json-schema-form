import { RequiredSchemaValueValidationService } from './required-schema-value-validation.service';
import { SchemaHelperService } from './schema-helper.service';

describe('RequiredSchemaValueValidationService', () => {
  let basicSchema: any;
  let oneOfSchema: any;
  const dropdownWithChildren = {
    name: 'Dropdown with Children 1',
    display: 'dropdown',
    oneOf: [
    {
      type: 'object',
      name: 'Option 1',
      key: 'option1',
      required: ['child1'],
      properties: {
        child1: {
          type: 'string',
          name: 'Child 1 of Option 1'
        },
        child2: {
          type: 'string',
          name: 'Child 2 of Option 1'
        }
      }
    },
    {
      type: 'object',
      name: 'Option 2',
      key: 'option2',
      required: [ 'child2' ],
      properties: {
        child1: {
          type: 'string',
          name: 'Child 1 of Option 2'
        },
        child2: {
          type: 'string',
          name: 'Child 2 of Option 2'
        }
      }
    }
    ]
  };

  beforeEach(() => {
    oneOfSchema = {
      object: {
        type: 'object',
        properties: {
          dropdownWithChildren: dropdownWithChildren
        }
      }
    };
    basicSchema = {
      type: 'object',
      required: ['checkbox', 'numberInput'],
      properties: {
        checkbox: {
          type: 'boolean',
          name: 'Checkbox Input'
        },
        numberInput: {
          type: 'number',
          name: 'Number Input'
        },
        textInput: {
          type: 'string',
          name: 'Text Input'
        }
      }
    };
  });

  describe('getRequiredKeysFromSchemaOnly()', () => {
    it('should return an array of required paths when at the root level of the schema', () => {
      const flattenedSchema = SchemaHelperService.getFlattenedObject(basicSchema);
      const result = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaOnly(flattenedSchema);
      expect(result[0]).toEqual('checkbox');
      expect(result[1]).toEqual('numberInput');
    });

    it('should return an array of required paths when nested beneath a parent object', () => {
      const schema = {
        object: { ...basicSchema }
      };

      const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
      const result = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaOnly(flattenedSchema);
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual('object.checkbox');
      expect(result[1]).toEqual('object.numberInput');
    });

    it('should return an array of required paths when a required field is deeply nested', () => {
      const schema = {
        object1: {
          type: 'object',
          properties: {
            object2: {
              type: 'object',
              properties: {
                object3: {
                  type: 'object',
                  required: ['checkbox'],
                  properties: {
                    checkbox: {
                      type: 'boolean',
                      name: 'Checkbox Input'
                    }
                  }
                }
              }
            }
          }
        }
      };

      const flattenedSchema = SchemaHelperService.getFlattenedObject(schema);
      const result = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaOnly(flattenedSchema);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual('object1.object2.object3.checkbox');
    });

    it('should return an array of required paths when a required field is an XOf object', () => {
      const flattenedSchema = SchemaHelperService.getFlattenedObject(oneOfSchema);
      const result = RequiredSchemaValueValidationService.getRequiredKeysFromSchemaOnly(flattenedSchema);
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual('object.dropdownWithChildren.oneOf[0].child1');
      expect(result[1]).toEqual('object.dropdownWithChildren.oneOf[1].child2');
    });
  });

  describe('valuesHaveRequiredKeys()', () => {
    let option1Values: object;
    let option2Values: object;
    let values: any;

    beforeEach(() => {
      values = {};
      option1Values = {
        option1: {
          child1: 'hello',
          child2: 'world'
        }
      };
      option2Values = {
        option2: {
          child1: 'hello',
          child2: 'world'
        }
      };
    });

    it('should return true if there are no required fields', () => {
      delete basicSchema.required;
      expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(true);
    });

    it('should return false if one or more required fields are not present', () => {
      expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(false);

      values = { checkbox: true };
      expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(false);
    });

    describe('oneOf', () => {
      const rootOneOf2 = {
        name: 'Dropdown with Children 2',
        display: 'dropdown',
        oneOf: [
          {
            type: 'object',
            name: 'Option 1',
            key: 'option1',
            required: ['child1'],
            properties: {
              child1: {
                type: 'string',
                name: 'Child 1 of Option 1'
              },
              child2: {
                type: 'string',
                name: 'Child 2 of Option 1'
              }
            }
          },
          {
            type: 'object',
            name: 'Option 2',
            key: 'option2',
            required: [ 'child2' ],
            properties: {
              child1: {
                type: 'string',
                name: 'Child 1 of Option 2'
              },
              child2: {
                type: 'string',
                name: 'Child 2 of Option 2'
              }
            }
          }
        ]
      };

      it('should return true if one option is selected (and all necessary required fields are included)', () => {
        values = {
         object: {
           dropdownWithChildren: {
             option2: {
               child2: 'whoa'
             }
           }
         }
        };
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
      });

      it('should return false if the values include more than one oneOf option', () => {
        values = {
          object: {
            dropdownWithChildren: {
              ...option1Values,
              ...option2Values
            }
          }
        };
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(false);
      });

      describe('with secured values', () => {
        beforeEach(() => {
          oneOfSchema.object.properties.dropdownWithChildren.oneOf[1].properties.child2.isSecured = true;
          values = {
            object: {
              dropdownWithChildren: {
                option2: {}
              }
            }
          };
        });

        afterEach(() => {
          delete oneOfSchema.object.properties.dropdownWithChildren.oneOf[1].properties.child2.isSecured;
        });

        it('should return true if a field is secured and required and is not found in the values, but it does not have to be present', () => {
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
        });

        it('should return false if a field is secured and required and is not found in the values when it should be', () => {
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, true)).toBe(false);
        });

        it('should return true if a field is secured and required and is found in the values, even if it does not have to be present', () => {
          values.object.dropdownWithChildren.option2.child2 = 'cbdwh';
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
        });

        it('should return true if a field is secured and required and is found in the values when it should be present', () => {
          values.object.dropdownWithChildren.option2.child2 = 'cbdwh';
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, true)).toBe(true);
        });
      });

      describe('with multiple oneOfs', () => {
        beforeEach(() => {
          oneOfSchema.object.properties.dropdownWithChildren2 = {...rootOneOf2 };
          values = {
            object: {
              dropdownWithChildren: {
                ...option1Values
              },
              dropdownWithChildren2: {
                ...option2Values
              }
            }
          };
        });

        it('should return true if there are more than one oneOf and all required keys are present', () => {
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
        });

        it('should return false if there is one oneOf without a required field', () => {
          delete values.object.dropdownWithChildren.option1.child1;
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(false);
        });

        describe('with a nested oneOf', () => {
          beforeEach(() => {
            oneOfSchema.object.properties.dropdownWithChildren2.oneOf[1] = { key: 'nestedDropdown', type: 'object', properties: { actualDropdown: { ...dropdownWithChildren }}};
            values.object.dropdownWithChildren2 = { nestedDropdown: { actualDropdown: { ...option2Values }}};
          });

          it('should return true with multiple oneOfs and a nested oneOf if all required properties are present', () => {
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
          });

          it('should return true if the nested oneOf parent is not selected', () => {
            delete values.object.dropdownWithChildren2.nestedDropdown;
            values.object.dropdownWithChildren2 = { ...option1Values };
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
          });

          it('should return false if the nested parent is selected, but the required nested value is not present', () => {
            values.object.dropdownWithChildren2.nestedDropdown.actualDropdown.option2 = {};
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(false);
          });

          describe('with a sibling required field', () => {
            beforeEach(() => {
              oneOfSchema.object.properties.dropdownWithChildren2.oneOf[1].properties.stringThing = { type: 'string' };
              oneOfSchema.object.properties.dropdownWithChildren2.oneOf[1].required = ['stringThing'];
            });

            it('should return false if the nested parent is selected and the required nested value is present, but the non-nested required value is not.', () => {
              expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(false);
            });

            it('should return true if the nested parent is selected, and both the immediate required value and the required nested value is present.', () => {
              values.object.dropdownWithChildren2.nestedDropdown.stringThing = 'hello';
              expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
            });

            describe('with secured values', () => {
              beforeEach(() => {
                oneOfSchema.object.properties.dropdownWithChildren2.oneOf[1].properties.stringThing.isSecured = true;
                oneOfSchema.object.properties.dropdownWithChildren2.oneOf[1].properties.actualDropdown.oneOf[1].properties.child2.isSecured = true;
                values = {
                  object: {
                    dropdownWithChildren2: {
                      nestedDropdown: {
                        stringThing: 'fbjwebqi',
                        actualDropdown: {
                          option2: {
                            child2: 'fbjdwbai'
                          }
                        }
                      }
                    }
                  }
                };
              });

              afterEach(() => {
                delete oneOfSchema.object.properties.dropdownWithChildren2.oneOf[1].properties.stringThing.isSecured;
                delete oneOfSchema.object.properties.dropdownWithChildren2.oneOf[1].properties.actualDropdown.oneOf[1].properties.child2.isSecured;
              });

              it('should return true when there are nested and sibling secured-required fields that have corresponding values that should be there', () => {
                  expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, true)).toBe(true);
              });

              it('should return true when there are nested and sibling secured-required fields that have corresponding values that do not have to be there', () => {
                expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
              });

              it('should return false when a sibling secured field is not present in the values, but should be', () => {
                delete values.object.dropdownWithChildren2.nestedDropdown.stringThing;
                expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, true)).toBe(false);
              });

              it('should return false when a nested secured field is not present in the values, but should be', () => {
                delete values.object.dropdownWithChildren2.nestedDropdown.actualDropdown.option2.child2;
                expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, true)).toBe(false);
              });

              it('should return false when nested and sibling secured fields are not present in the values, but should be', () => {
                delete values.object.dropdownWithChildren2.nestedDropdown.stringThing;
                delete values.object.dropdownWithChildren2.nestedDropdown.actualDropdown.option2.child2;
                expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, true)).toBe(false);
              });

              it('should return true when a sibling secured field is not present in the values and does not have to be', () => {
                delete values.object.dropdownWithChildren2.nestedDropdown.stringThing;
                expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
              });

              it('should return true when a nested secured field is not present in the values and does not have to be', () => {
                delete values.object.dropdownWithChildren2.nestedDropdown.actualDropdown.option2.child2;
                expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, false)).toBe(true);
              });

              it('should return true when the oneOf option without secured values is selected', () => {
                values.object.dropdownWithChildren2 = { ...option1Values };
                expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(oneOfSchema, values, true)).toBe(true);
              });
            });
          });
        });
      });
    });

    describe('allOf', () => {
      let allOfSchema: any;

      beforeEach(() => {
        allOfSchema = {
          allOf: [
            {
              type: 'object',
              key: 'thing1',
              required: ['child1', 'child2'],
              properties: {
                child1: {
                  type: 'string'
                },
                child2: {
                  type: 'string'
                }
              }
            },
            {
              type: 'object',
              key: 'thing2',
              required: [ 'child3' ],
              properties: {
                child3: {
                  type: 'string'
                },
                child4: {
                  type: 'string'
                }
              }
            }
          ]
        };
        values = {
          thing1: {
            child1: 'bfejwkq',
            child2: 'bfdhw'
          },
          thing2: {
            child3: 'bvfekja',
            child4: 'hfdwq'
          }
        };
      });

      it('should return true if all required fields of all objects are present', () => {
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(true);
      });

      it('should return false if all objects are present, but some required values are not present', () => {
        delete values.thing1.child1;
        delete values.thing2.child3;
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(false);
      });

      describe('with no required fields', () => {
        beforeEach(() => {
          allOfSchema.allOf[0].required = [];
          allOfSchema.allOf[1].required = [];
        });

        it('should return true if all objects are present and there are no required fields', () => {
          values.thing1 = {};
          values.thing2 = {};
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(true);
        });

        it('should return false if there are no required fields, but not all objects are present', () => {
          delete values.thing1;
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(false);
        });
      });

      describe('with secured-required fields', () => {
        beforeEach(() => {
          allOfSchema.allOf[0].properties.child1.isSecured = true;
          allOfSchema.allOf[1].properties.child3.isSecured = true;
        });

        it('should return true if all required fields are present, including secured, when they should be included', () => {
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, true)).toBe(true);
        });

        it('should return false when a secured-required field is not included and should be', () => {
          delete values.thing1.child1;
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, true)).toBe(false);
        });
      });

      describe('with nested allOfs', () => {
        let xOfArray;

        beforeEach(() => {
          xOfArray = [
            {
              type: 'object',
              key: 'nested1',
              required: ['dude1'],
              properties: {
                dude1: {
                  type: 'string'
                },
                dude2: {
                  type: 'string'
                }
              }
            },
            {
              type: 'object',
              key: 'nested2',
              required: [],
              properties: {
                dude3: {
                  type: 'string'
                },
                dude4: {
                  type: 'string'
                }
              }
            }
          ];

          allOfSchema.allOf[0].properties.nestedGuy = {
            allOf: xOfArray
          };

          values.thing1.nestedGuy = {
            nested1: {
              dude1: 'bcjkdwbkja',
              dude2: 'fbcdwbbfew'
            },
            nested2: {
              dude3: 'fbjebqk',
              dude4: 'hjwa'
            }
          };
        });

        it('should return true if all required fields are present when they have to be', () => {
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, true)).toBe(true);
        });

        it('should return false if required fields in the nested oneOf are not present', () => {
          values.thing1.nestedGuy.nested1 = {};
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, true)).toBe(false);
        });

        it('should return false if a nested oneOf object is not present', () => {
          delete values.thing1.nestedGuy.nested2;
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, true)).toBe(false);
        });

        it('should return false if a top-level oneOf object is not present', () => {
          delete values.thing1;
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, true)).toBe(false);
        });

        it('should return true when no fields are present and there are no required fields', () => {
          delete allOfSchema.allOf[0].required;
          delete allOfSchema.allOf[0].properties.nestedGuy.allOf[0].required;
          allOfSchema.allOf[1].required = [];

          values.thing1.nestedGuy.nested1 = {};
          values.thing1.nestedGuy.nested2 = {};
          values.thing2 = {};

          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(true);
        });

        describe('with secured-required fields', () => {
          beforeEach(() => {
            allOfSchema.allOf[0].properties.child1.isSecured = true;
            allOfSchema.allOf[0].properties.nestedGuy.allOf[0].properties.dude1.isSecured = true;
          });

          it('should return true if all required and secured-required fields are present when secured fields should be included', () => {
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, true)).toBe(true);
          });

          it('should return true if secured-required fields are present when they do not have to be', () => {
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(true);
          });

          it('should return true if secured-required fields are not present and should not be included', () => {
            delete values.thing1.child1;
            delete values.thing1.nestedGuy.nested1.dude1;
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(true);
          });
        });

        describe('with a nested oneOf instead of a nested allOf', () => {
          beforeEach(() => {
            allOfSchema.allOf[0].properties.nestedGuy = {
              oneOf: xOfArray
            };
          });

          it('should return false if the nested oneOf has more than one object included', () => {
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(false);
          });

          it('should return false if the nested oneOf has no objects selected', () => {
            delete values.thing1.nestedGuy.nested1;
            delete values.thing1.nestedGuy.nested2;
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(false);
          });

          it('should return true if one object is selected in the nested oneOf', () => {
            delete values.thing1.nestedGuy.nested1;
            expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(allOfSchema, values, false)).toBe(true);
          });
        });
      });
    });

    describe('conditional controls', () => {
      beforeEach(() => {
        basicSchema.isConditional = true;
        values = {
          value: true,
          checkbox: true,
          numberInput: 1234,
          textInput: 'bdhewbhiq'
        };
      });

      it('should return true if the control is true and all of its required fields are present', () => {
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(true);
      });

      it('should return false if the control is true and one or more of its required fields are not present', () => {
        delete values.numberInput;
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(false);
      });

      it('should return true if the control is not selected and none of its required children are present', () => {
        values = { value: false };
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(true);
      });

      it('should return true if the control is not selected but children are still present', () => {
        values.value = false;
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(true);
      });

      describe('with secured fields', () => {
        beforeEach(() => {
          basicSchema.properties.textInput.isSecured = true;
        });

        it('should return true if the control is selected and a secured-required child is not present, but secured-required fields should not be included', () => {
          delete values.textInput;
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(true);
        });

        it('should return false if the control is selected and a secured-required field is not present, but should be', () => {
          delete values.textInput;
          expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, true)).toBe(true);
        });
      });

      it('should return true if the control is selected and the secured field is present as it should be', () => {
        expect(RequiredSchemaValueValidationService.valuesHaveRequiredKeys(basicSchema, values, false)).toBe(true);
      });
    });
  });
});

import "./App.css";

import { useEffect, useRef, useState } from "react";

import sampleManifestJson from "./sample-manifest.json";

function jsonToForm(object: {
  manifest: {
    data: {
      fields: {
        [key: string]: {
          inputName: string;
          ui: {
            label: string;
          };
          const: {
            [key: string]: string;
          };
        };
      };
    };
  };
}): {
  name: string;
  label: string;
  inputName: string;
  const: {
    name: string;
    value: string;
  }[];
}[] {
  const arr = [];

  for (const key in object.manifest.data.fields) {
    const fieldObj = object.manifest.data.fields[key];

    const constsObj = fieldObj.const;
    const constsArr = [];
    for (const constKey in constsObj) {
      constsArr.push({
        name: constKey,
        value: constsObj[constKey],
      });
    }
    arr.push({
      name: key,
      label: fieldObj.ui?.label,
      inputName: fieldObj.inputName,
      const: constsArr,
    });
  }
  return arr;
}

function formToJson(formData: {
  fields: {
    name: string;
    label: string;
    inputName: string;
    const: {
      name: string;
      value: string;
    }[];
  }[];
}): string {
  const fields: {
    [key: string]: {
      inputName: string;
      ui: {
        label: string;
      };
      const: {
        [key: string]: string;
      };
    };
  } = {};

  formData.fields.forEach((element) => {
    const constObject: {
      [key: string]: string;
    } = {};
    element.const.forEach((c) => {
      constObject[c.name] = c.value;
    });

    fields[element.name] = {
      inputName: element.inputName,
      ui: {
        label: element.label,
      },
      const: constObject,
    };
  });

  return JSON.stringify({ manifest: { data: { fields: fields } } }, null, 2);
}

function App() {
  const [manifestJson, setManifestJson] = useState("{}");

  const isUpdatingFromForm = useRef(false);
  const isUpdatingFromJson = useRef(true);

  const [manifestForm, setManifestForm] = useState<{
    fields: {
      name: string;
      label: string;
      inputName: string;
      const: {
        name: string;
        value: string;
      }[];
    }[];
    hooks?: {
      pre: {
        factory: string;
      }[];
      post: {
        factory: string;
      }[];
    };
  }>();

  const resetForm = () => {
    setManifestForm({
      fields: [
        {
          name: "test",
          label: "",
          inputName: "",
          const: [],
        },
      ],
    });
  };

  useEffect(() => {
    if (isUpdatingFromJson.current && manifestJson && manifestJson !== "{}") {
      try {
        const parsedJson = JSON.parse(manifestJson);
        const fields = jsonToForm(parsedJson);
        setManifestForm({
          fields,
        });
      } catch (e) {
        console.error(e);
        resetForm();
      }
    }
    if (
      isUpdatingFromJson.current &&
      (manifestJson === "{}" || manifestJson === "")
    ) {
      resetForm();
    }
    isUpdatingFromForm.current = false;
    isUpdatingFromJson.current = false;
  }, [manifestJson]);

  useEffect(() => {
    if (isUpdatingFromForm.current && manifestForm) {
      console.log("form to json", manifestForm);

      const json = formToJson(manifestForm);
      setManifestJson(json);
    }
    isUpdatingFromJson.current = false;
    isUpdatingFromForm.current = false;
  }, [manifestForm]);

  useEffect(() => {
    isUpdatingFromJson.current = true;
    setManifestJson(JSON.stringify(sampleManifestJson, null, 2));
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <header className=""></header>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "90%",
        }}
      >
        <div style={{ width: "inherit", padding: "16px" }}>
          <pre>{JSON.stringify(manifestForm, null, 2)}</pre>
          {isUpdatingFromJson.current ? "isUpdatingFromJson" : ""}
          <br />
          {isUpdatingFromForm.current ? "isUpdatingFromForm" : ""}

          {manifestForm ? (
            <>
              <div style={{ padding: "16px", display: "flex", gap: "4px 8px" }}>
                <span>Fields</span>
                <button
                  onClick={() => {
                    const newForm = {
                      fields: [
                        ...manifestForm.fields,
                        {
                          name: manifestForm.fields.length + ". Field",
                          label: "",
                          inputName: "",
                          const: [],
                        },
                      ],
                      hooks: manifestForm.hooks,
                    };
                    console.log("add field", newForm);
                    isUpdatingFromForm.current = true;
                    isUpdatingFromJson.current = false;
                    setManifestForm(newForm);
                  }}
                >
                  <span role="img" aria-label="add">
                    ➕
                  </span>
                </button>
              </div>

              {manifestForm.fields.map((field: any, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: "8px",
                    margin: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px 8px",
                    border: "1px solid black",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "4px 8px",
                    }}
                  >
                    <input
                      onChange={(e) => {
                        //update field name value
                      }}
                      value={field.name}
                    ></input>
                    <input
                      onChange={(e) => {
                        //update field name value
                      }}
                      value={field.inputName}
                    ></input>
                    <button
                      onClick={() => {
                        //delete field
                      }}
                    >
                      <span role="img" aria-label="delete">
                        ❌
                      </span>
                    </button>
                  </div>

                  <div>
                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        gap: "4px 8px",
                      }}
                    >
                      <span>Consts</span>
                      <button
                        onChange={() => {
                          //add field
                        }}
                      >
                        <span role="img" aria-label="delete">
                          ➕
                        </span>
                      </button>
                    </div>
                    <div style={{ flexDirection: "column" }}>
                      {field.const.map((c: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "4px 8px",
                          }}
                        >
                          <input
                            onChange={(e) => {
                              //update const name value
                            }}
                            value={c.name}
                          ></input>
                          <input
                            onChange={(e) => {
                              //update const value
                            }}
                            value={c.value}
                          ></input>
                          <button
                            onChange={() => {
                              //delete const
                            }}
                          >
                            <span role="img" aria-label="delete">
                              ❌
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
        <div style={{ width: "inherit", padding: "16px" }}>
          <textarea
            style={{
              borderStyle: "",
              borderWidth: "",
              borderColor: "",
              boxShadow: "inset 0px 0px 0px 0px red",
              width: "100%",
              height: "100%",
              resize: "none",
            }}
            onChange={(e) => {
              isUpdatingFromJson.current = true;
              isUpdatingFromForm.current = false;
              setManifestJson(e.target.value);
            }}
            value={manifestJson}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default App;

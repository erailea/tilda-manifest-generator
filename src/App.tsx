import "./App.css";

import {
  Add,
  Delete,
  GppBadRounded,
  GppGoodRounded,
} from "@mui/icons-material";
import {
  CardHeader,
  Container,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

import sampleManifestJson from "./sample-manifest.json";

interface FormManifest {
  fields: FormField[];
  hooks?: FormHooks;
}

interface FormField {
  name: string;
  label: string;
  inputName: string;
  const: FormConst[];
}

interface FormConst {
  name: string;
  value: string;
  isSecure: boolean;
}

interface FormHook {
  factory: string;
}

interface FormHooks {
  pre: FormHook[];
  post: FormHook[];
}

interface Constant {
  [key: string]: string;
}

interface Ui {
  label: string;
}

interface Fields {
  [key: string]: {
    inputName: string;
    ui: Ui;
    const: Constant;
  };
}

interface Manifest {
  data: {
    fields: Fields;
  };
}

function jsonToForm(object: { manifest: Manifest }): FormManifest {
  const arr: FormField[] = [];

  for (const key in object.manifest.data.fields) {
    const fieldObj = object.manifest.data.fields[key];

    const constsObj = fieldObj.const;
    const constsArr: FormConst[] = [];
    for (const constKey in constsObj) {
      constsArr.push({
        isSecure: constKey.endsWith(":enc"),
        name: constKey.split(":")[0],
        value: constsObj[constKey],
      } as FormConst);
    }
    arr.push({
      name: key,
      label: fieldObj.ui?.label,
      inputName: fieldObj.inputName,
      const: constsArr,
    });
  }
  return {
    fields: arr,
    hooks: {
      pre: [],
      post: [],
    },
  };
}

function formToJson(formData: {
  fields: {
    name: string;
    label: string;
    inputName: string;
    const: {
      name: string;
      value: string;
      isSecure: boolean;
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
      const suffix = c.isSecure ? ":enc" : "";
      constObject[c.name + suffix] = c.value;
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

  const [manifestForm, setManifestForm] = useState<FormManifest>({
    fields: [],
  });

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
        const form = jsonToForm(parsedJson);
        setManifestForm(form);
      } catch (e) {
        console.error(e);
        resetForm();
        isUpdatingFromJson.current = true;
        isUpdatingFromForm.current = false;
      }
    }
    if (
      isUpdatingFromJson.current &&
      (manifestJson === "{}" || manifestJson === "" || !manifestJson)
    ) {
      resetForm();
      isUpdatingFromJson.current = true;
      isUpdatingFromForm.current = false;
    } else {
      isUpdatingFromForm.current = false;
      isUpdatingFromJson.current = false;
    }
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
    <Container style={{ padding: "16px" }}>
      <Grid direction={"row"} container height={"100%"} width={"100%"}>
        <Grid gap={"16px"} item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Grid width={"100%"} gap={"16px"} container spacing={"16px"}>
            <Grid>
              <span>Fields</span>
              <IconButton
                color="primary"
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
                  isUpdatingFromForm.current = true;
                  isUpdatingFromJson.current = false;
                  setManifestForm(newForm);
                }}
              >
                <Add />
              </IconButton>
            </Grid>

            {manifestForm.fields.map((field: any, fieldIndex: number) => (
              <Grid
                sx={{
                  width: "100%",
                  padding: "16px",
                  marginBottom: "16px",
                  "--Grid-borderWidth": "1px",
                  borderTop: "var(--Grid-borderWidth) solid",
                  borderLeft: "var(--Grid-borderWidth) solid",
                  borderRight: "var(--Grid-borderWidth) solid",
                  borderBottom: "var(--Grid-borderWidth) solid",
                  borderColor: "divider",
                }}
                key={fieldIndex}
                style={{}}
              >
                <Grid gap={"16px"} container>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      label={"Field Name"}
                      onChange={(e) => {
                        const newForm = {
                          fields: manifestForm.fields.map((f, i) =>
                            i === fieldIndex
                              ? { ...f, name: e.target.value }
                              : f
                          ),
                          hooks: manifestForm.hooks,
                        };
                        isUpdatingFromForm.current = true;
                        isUpdatingFromJson.current = false;
                        setManifestForm(newForm);
                      }}
                      value={field.name}
                    ></TextField>
                  </Grid>

                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <TextField
                      label={"Input Name"}
                      onChange={(e) => {
                        //find by index and update inputName
                        const newForm = {
                          fields: manifestForm.fields.map((f, i) =>
                            i === fieldIndex
                              ? { ...f, inputName: e.target.value }
                              : f
                          ),
                          hooks: manifestForm.hooks,
                        };
                        isUpdatingFromForm.current = true;
                        isUpdatingFromJson.current = false;
                        setManifestForm(newForm);
                      }}
                      value={field.inputName}
                    ></TextField>
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        const newForm = {
                          fields: manifestForm.fields.filter(
                            (f, i) => i !== fieldIndex
                          ),
                          hooks: manifestForm.hooks,
                        };
                        isUpdatingFromForm.current = true;
                        isUpdatingFromJson.current = false;
                        setManifestForm(newForm);
                      }}
                      aria-label="delete"
                      size="medium"
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid>
                  <span>Constant Values</span>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      //find field by fieldIndex and add new const
                      const newForm = {
                        fields: manifestForm.fields.map((f, i) =>
                          i === fieldIndex
                            ? {
                                ...f,
                                const: [
                                  ...f.const,
                                  {
                                    name: f.const.length + 1 + ". const",
                                    value: "",
                                    isSecure: false,
                                  },
                                ],
                              }
                            : f
                        ),
                        hooks: manifestForm.hooks,
                      };
                      isUpdatingFromForm.current = true;
                      isUpdatingFromJson.current = false;
                      setManifestForm(newForm);
                    }}
                  >
                    <Add />
                  </IconButton>
                </Grid>
                {field.const.length > 0 && (
                  <Grid
                    sx={{
                      width: "100%",
                      padding: "16px",
                      marginBottom: "16px",
                      "--Grid-borderWidth": "1px",
                      borderTop: "var(--Grid-borderWidth) solid",
                      borderLeft: "var(--Grid-borderWidth) solid",
                      borderRight: "var(--Grid-borderWidth) solid",
                      borderBottom: "var(--Grid-borderWidth) solid",
                      borderColor: "divider",
                    }}
                    gap={"2px"}
                    container
                  >
                    {field.const.map((c: any, constIndex: number) => (
                      <Grid gap={"16px"} container key={constIndex}>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            onChange={(e) => {
                              //find field by fieldIndex and const by constIndex and update name
                              const newForm = {
                                fields: manifestForm.fields.map((f, i) =>
                                  i === fieldIndex
                                    ? {
                                        ...f,
                                        const: f.const.map((c, j) =>
                                          j === constIndex
                                            ? { ...c, name: e.target.value }
                                            : c
                                        ),
                                      }
                                    : f
                                ),
                                hooks: manifestForm.hooks,
                              };
                              isUpdatingFromForm.current = true;
                              isUpdatingFromJson.current = false;
                              setManifestForm(newForm);
                            }}
                            value={c.name}
                          ></TextField>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <TextField
                            onChange={(e) => {
                              //find field by fieldIndex and const by constIndex and update value
                              const newForm = {
                                fields: manifestForm.fields.map((f, i) =>
                                  i === fieldIndex
                                    ? {
                                        ...f,
                                        const: f.const.map((c, j) =>
                                          j === constIndex
                                            ? {
                                                ...c,
                                                value: e.target.value,
                                              }
                                            : c
                                        ),
                                      }
                                    : f
                                ),
                                hooks: manifestForm.hooks,
                              };
                              isUpdatingFromForm.current = true;
                              isUpdatingFromJson.current = false;
                              setManifestForm(newForm);
                            }}
                            value={c.value}
                          ></TextField>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                          <IconButton
                            color="error"
                            onClick={() => {
                              const newForm = {
                                fields: manifestForm.fields.map((f, i) =>
                                  i === fieldIndex
                                    ? {
                                        ...f,
                                        const: f.const.filter(
                                          (c, j) => j !== constIndex
                                        ),
                                      }
                                    : f
                                ),
                                hooks: manifestForm.hooks,
                              };
                              isUpdatingFromForm.current = true;
                              isUpdatingFromJson.current = false;
                              setManifestForm(newForm);
                            }}
                            aria-label="delete"
                            size="medium"
                          >
                            <Delete fontSize="inherit" />
                          </IconButton>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                          <IconButton
                            color={c.isSecure ? "success" : "error"}
                            onClick={() => {
                              //find field by fieldIndex and const by constIndex and update isSecure
                              const newForm = {
                                fields: manifestForm.fields.map((f, i) =>
                                  i === fieldIndex
                                    ? {
                                        ...f,
                                        const: f.const.map((c, j) =>
                                          j === constIndex
                                            ? {
                                                ...c,
                                                isSecure: !c.isSecure,
                                              }
                                            : c
                                        ),
                                      }
                                    : f
                                ),
                                hooks: manifestForm.hooks,
                              };
                              isUpdatingFromForm.current = true;
                              isUpdatingFromJson.current = false;
                              setManifestForm(newForm);
                            }}
                            aria-label="delete"
                            size="medium"
                          >
                            {c.isSecure ? (
                              <GppGoodRounded fontSize="inherit" />
                            ) : (
                              <GppBadRounded fontSize="inherit" />
                            )}
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <TextField
            multiline
            rows={30}
            style={{ width: "100%" }}
            onChange={(e) => {
              isUpdatingFromJson.current = true;
              isUpdatingFromForm.current = false;
              setManifestJson(e.target.value);
            }}
            value={manifestJson}
          ></TextField>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;

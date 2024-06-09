import "./App.css";

import {
  Add,
  Delete,
  GppBadRounded,
  GppGoodRounded,
} from "@mui/icons-material";
import {
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import {
  Fields,
  FormConst,
  FormField,
  FormManifest,
  FormValidator,
  Manifest,
  Validator,
} from "./models";
import { useEffect, useRef, useState } from "react";

import sampleManifestJson from "./sample-manifest.json";

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
          validators: [],
        },
      ],
    });
  };

  useEffect(() => {
    if (isUpdatingFromJson.current && manifestJson && manifestJson !== "{}") {
      try {
        const parsedJson = JSON.parse(manifestJson);
        const form = Manifest.toForm(parsedJson);
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

      const manifest = FormManifest.toManifest(manifestForm);
      setManifestJson(JSON.stringify({ manifest }, null, 2));
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
        <Grid container gap={"16px"} item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Grid
            key="fields"
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
            width={"100%"}
            gap={"16px"}
            spacing={"16px"}
            container
          >
            <Grid>
              <span>Fields</span>
              <IconButton
                color="primary"
                onClick={() => {
                  const newForm: FormManifest = {
                    fields: [
                      ...manifestForm.fields,
                      {
                        name: manifestForm.fields.length + ". Field",
                        label: "",
                        inputName: "",
                        const: [],
                        validators: [],
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

            {manifestForm.fields.map((field: FormField, fieldIndex: number) => (
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
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      size="small"
                      label={"Field Name"}
                      onChange={(e) => {
                        const newForm: FormManifest = {
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

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      size="small"
                      label={"Input Name"}
                      onChange={(e) => {
                        //find by index and update inputName
                        const newForm: FormManifest = {
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
                    ></TextField>{" "}
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                    <TextField
                      size="small"
                      label={"UI Label"}
                      onChange={(e) => {
                        //find by index and update inputName
                        const newForm: FormManifest = {
                          fields: manifestForm.fields.map((f, i) =>
                            i === fieldIndex
                              ? { ...f, label: e.target.value }
                              : f
                          ),
                          hooks: manifestForm.hooks,
                        };
                        isUpdatingFromForm.current = true;
                        isUpdatingFromJson.current = false;
                        setManifestForm(newForm);
                      }}
                      value={field.label}
                    ></TextField>
                  </Grid>

                  <Grid item>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        const newForm: FormManifest = {
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
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </Grid>
                </Grid>

                <Grid>
                  <span>Constant Values</span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      //find field by fieldIndex and add new const
                      const newForm: FormManifest = {
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
                            size="small"
                            onChange={(e) => {
                              //find field by fieldIndex and const by constIndex and update name
                              const newForm: FormManifest = {
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
                            size="small"
                            onChange={(e) => {
                              //find field by fieldIndex and const by constIndex and update value
                              const newForm: FormManifest = {
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
                        <Grid item>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              const newForm: FormManifest = {
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
                          >
                            <Delete fontSize="inherit" />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            size="small"
                            color={c.isSecure ? "success" : "error"}
                            onClick={() => {
                              //find field by fieldIndex and const by constIndex and update isSecure
                              const newForm: FormManifest = {
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

                <Grid>
                  <span>Validators</span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      //find field by fieldIndex and add new const
                      const newForm: FormManifest = {
                        fields: manifestForm.fields.map((f, i) =>
                          i === fieldIndex
                            ? {
                                ...f,
                                validators: [
                                  ...f.validators,
                                  {
                                    factory: "alpha",
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
                {field.validators.length > 0 && (
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
                    {field.validators.map(
                      (v: FormValidator, validatorIndex: number) => (
                        <Grid gap={"16px"} container key={validatorIndex}>
                          <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                            <>
                              <FormControl size="small">
                                <Select
                                  labelId="demo-simple-select-label"
                                  value={v.factory}
                                  label="Type"
                                  onChange={(e) => {
                                    //find field by fieldIndex and validator by validatorIndex and update factory
                                    const newForm: FormManifest = {
                                      fields: manifestForm.fields.map((f, i) =>
                                        i === fieldIndex
                                          ? {
                                              ...f,
                                              validators: f.validators.map(
                                                (c, j) =>
                                                  j === validatorIndex
                                                    ? ({
                                                        factory: e.target.value,
                                                        minLength: 0,
                                                        maxLength: 100,
                                                        regex: "",
                                                        onMatch: "pass",
                                                        enumValues: [],
                                                      } as FormValidator)
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
                                >
                                  <MenuItem value={"alpha"}>
                                    Alphabetic
                                  </MenuItem>
                                  <MenuItem value={"numeric"}>Numeric</MenuItem>
                                  <MenuItem value={"alphanumeric"}>
                                    Alphanumeric
                                  </MenuItem>
                                  <MenuItem value={"regex"}>Regex</MenuItem>
                                  <MenuItem value={"length"}>Length</MenuItem>
                                  <MenuItem value={"notEmpty"}>
                                    Required
                                  </MenuItem>
                                  <MenuItem value={"enum"}>Enum</MenuItem>
                                </Select>
                              </FormControl>
                            </>
                          </Grid>
                          {v.factory === "length" && (
                            <>
                              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                <TextField
                                  size="small"
                                  label={"Min Length"}
                                  onChange={(e) => {
                                    //find field by fieldIndex and validator by validatorIndex and update minLength
                                    const newForm: FormManifest = {
                                      fields: manifestForm.fields.map((f, i) =>
                                        i === fieldIndex
                                          ? {
                                              ...f,
                                              validators: f.validators.map(
                                                (c, j) =>
                                                  j === validatorIndex
                                                    ? {
                                                        ...c,
                                                        minLength: parseInt(
                                                          e.target.value
                                                        ),
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
                                  value={v.minLength}
                                ></TextField>
                              </Grid>
                              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                <TextField
                                  size="small"
                                  label={"Max Length"}
                                  onChange={(e) => {
                                    //find field by fieldIndex and validator by validatorIndex and update maxLength
                                    const newForm: FormManifest = {
                                      fields: manifestForm.fields.map((f, i) =>
                                        i === fieldIndex
                                          ? {
                                              ...f,
                                              validators: f.validators.map(
                                                (c, j) =>
                                                  j === validatorIndex
                                                    ? {
                                                        ...c,
                                                        maxLength: parseInt(
                                                          e.target.value
                                                        ),
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
                                  value={v.maxLength}
                                ></TextField>
                              </Grid>
                            </>
                          )}
                          {v.factory === "regex" && (
                            <>
                              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                <TextField
                                  size="small"
                                  label={"Regex"}
                                  onChange={(e) => {
                                    //find field by fieldIndex and validator by validatorIndex and update regex
                                    const newForm: FormManifest = {
                                      fields: manifestForm.fields.map((f, i) =>
                                        i === fieldIndex
                                          ? {
                                              ...f,
                                              validators: f.validators.map(
                                                (c, j) =>
                                                  j === validatorIndex
                                                    ? {
                                                        ...c,
                                                        regex: e.target.value,
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
                                  value={v.regex}
                                ></TextField>
                              </Grid>
                              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                                <>
                                  <InputLabel>Match/Fail</InputLabel>
                                  <Switch
                                    size="small"
                                    checked={v.onMatch === "pass"}
                                    onChange={(e) => {
                                      //find field by fieldIndex and validator by validatorIndex and update onMatch
                                      const newForm: FormManifest = {
                                        fields: manifestForm.fields.map(
                                          (f, i) =>
                                            i === fieldIndex
                                              ? {
                                                  ...f,
                                                  validators: f.validators.map(
                                                    (c, j) =>
                                                      j === validatorIndex
                                                        ? {
                                                            ...c,
                                                            onMatch: e.target
                                                              .checked
                                                              ? "pass"
                                                              : "fail",
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
                                  ></Switch>
                                </>
                              </Grid>
                            </>
                          )}
                          <Grid item>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                const newForm: FormManifest = {
                                  fields: manifestForm.fields.map((f, i) =>
                                    i === fieldIndex
                                      ? {
                                          ...f,
                                          validators: f.validators.filter(
                                            (c, j) => j !== validatorIndex
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
                            >
                              <Delete fontSize="inherit" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      )
                    )}
                  </Grid>
                )}
              </Grid>
            ))}
          </Grid>
          <Grid
            key="hooks"
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
            width={"100%"}
            gap={"16px"}
            spacing={"16px"}
            container
          >
            <Grid key="pre" width={"100%"} gap={"16px"} container>
              <Grid>
                <span>Add Pre Hook</span>
                <IconButton color="primary" onClick={() => {}}>
                  <Add />
                </IconButton>
              </Grid>
            </Grid>
            <Grid key="post" width={"100%"} gap={"16px"} container>
              <Grid>
                <span>Add Post Hook</span>
                <IconButton color="primary" onClick={() => {}}>
                  <Add />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <TextField
            margin="none"
            size="small"
            multiline
            rows={30}
            style={{ width: "100%", padding: "none" }}
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

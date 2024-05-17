/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Autocomplete,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { listPages } from "../graphql/queries";
import { createBook, updatePage } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function BookCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    title: "",
    tableOfContents: "",
    imagePath: "",
    pages: [],
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [tableOfContents, setTableOfContents] = React.useState(
    initialValues.tableOfContents
  );
  const [imagePath, setImagePath] = React.useState(initialValues.imagePath);
  const [pages, setPages] = React.useState(initialValues.pages);
  const [pagesLoading, setPagesLoading] = React.useState(false);
  const [pagesRecords, setPagesRecords] = React.useState([]);
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTitle(initialValues.title);
    setTableOfContents(initialValues.tableOfContents);
    setImagePath(initialValues.imagePath);
    setPages(initialValues.pages);
    setCurrentPagesValue(undefined);
    setCurrentPagesDisplayValue("");
    setErrors({});
  };
  const [currentPagesDisplayValue, setCurrentPagesDisplayValue] =
    React.useState("");
  const [currentPagesValue, setCurrentPagesValue] = React.useState(undefined);
  const pagesRef = React.createRef();
  const getIDValue = {
    pages: (r) => JSON.stringify({ id: r?.id }),
  };
  const pagesIdSet = new Set(
    Array.isArray(pages)
      ? pages.map((r) => getIDValue.pages?.(r))
      : getIDValue.pages?.(pages)
  );
  const getDisplayValue = {
    pages: (r) => `${r?.bookTitle ? r?.bookTitle + " - " : ""}${r?.id}`,
  };
  const validations = {
    title: [{ type: "Required" }],
    tableOfContents: [],
    imagePath: [],
    pages: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const fetchPagesRecords = async (value) => {
    setPagesLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ bookTitle: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listPages.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listPages?.items;
      var loaded = result.filter(
        (item) => !pagesIdSet.has(getIDValue.pages?.(item))
      );
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setPagesRecords(newOptions.slice(0, autocompleteLength));
    setPagesLoading(false);
  };
  React.useEffect(() => {
    fetchPagesRecords("");
  }, []);
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          title,
          tableOfContents,
          imagePath,
          pages,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(
                    fieldName,
                    item,
                    getDisplayValue[fieldName]
                  )
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(
                fieldName,
                modelFields[fieldName],
                getDisplayValue[fieldName]
              )
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          const modelFieldsToSave = {
            title: modelFields.title,
            tableOfContents: modelFields.tableOfContents,
            imagePath: modelFields.imagePath,
          };
          const book = (
            await client.graphql({
              query: createBook.replaceAll("__typename", ""),
              variables: {
                input: {
                  ...modelFieldsToSave,
                },
              },
            })
          )?.data?.createBook;
          const promises = [];
          promises.push(
            ...pages.reduce((promises, original) => {
              promises.push(
                client.graphql({
                  query: updatePage.replaceAll("__typename", ""),
                  variables: {
                    input: {
                      id: original.id,
                      bookId: book.id,
                    },
                  },
                })
              );
              return promises;
            }, [])
          );
          await Promise.all(promises);
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "BookCreateForm")}
      {...rest}
    >
      <TextField
        label="Title"
        isRequired={true}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title: value,
              tableOfContents,
              imagePath,
              pages,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Table of contents"
        isRequired={false}
        isReadOnly={false}
        value={tableOfContents}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              tableOfContents: value,
              imagePath,
              pages,
            };
            const result = onChange(modelFields);
            value = result?.tableOfContents ?? value;
          }
          if (errors.tableOfContents?.hasError) {
            runValidationTasks("tableOfContents", value);
          }
          setTableOfContents(value);
        }}
        onBlur={() => runValidationTasks("tableOfContents", tableOfContents)}
        errorMessage={errors.tableOfContents?.errorMessage}
        hasError={errors.tableOfContents?.hasError}
        {...getOverrideProps(overrides, "tableOfContents")}
      ></TextField>
      <TextField
        label="Image path"
        isRequired={false}
        isReadOnly={false}
        value={imagePath}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              tableOfContents,
              imagePath: value,
              pages,
            };
            const result = onChange(modelFields);
            value = result?.imagePath ?? value;
          }
          if (errors.imagePath?.hasError) {
            runValidationTasks("imagePath", value);
          }
          setImagePath(value);
        }}
        onBlur={() => runValidationTasks("imagePath", imagePath)}
        errorMessage={errors.imagePath?.errorMessage}
        hasError={errors.imagePath?.hasError}
        {...getOverrideProps(overrides, "imagePath")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              title,
              tableOfContents,
              imagePath,
              pages: values,
            };
            const result = onChange(modelFields);
            values = result?.pages ?? values;
          }
          setPages(values);
          setCurrentPagesValue(undefined);
          setCurrentPagesDisplayValue("");
        }}
        currentFieldValue={currentPagesValue}
        label={"Pages"}
        items={pages}
        hasError={errors?.pages?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("pages", currentPagesValue)
        }
        errorMessage={errors?.pages?.errorMessage}
        getBadgeText={getDisplayValue.pages}
        setFieldValue={(model) => {
          setCurrentPagesDisplayValue(
            model ? getDisplayValue.pages(model) : ""
          );
          setCurrentPagesValue(model);
        }}
        inputFieldRef={pagesRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Pages"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Page"
          value={currentPagesDisplayValue}
          options={pagesRecords
            .filter((r) => !pagesIdSet.has(getIDValue.pages?.(r)))
            .map((r) => ({
              id: getIDValue.pages?.(r),
              label: getDisplayValue.pages?.(r),
            }))}
          isLoading={pagesLoading}
          onSelect={({ id, label }) => {
            setCurrentPagesValue(
              pagesRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentPagesDisplayValue(label);
            runValidationTasks("pages", label);
          }}
          onClear={() => {
            setCurrentPagesDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchPagesRecords(value);
            if (errors.pages?.hasError) {
              runValidationTasks("pages", value);
            }
            setCurrentPagesDisplayValue(value);
            setCurrentPagesValue(undefined);
          }}
          onBlur={() => runValidationTasks("pages", currentPagesDisplayValue)}
          errorMessage={errors.pages?.errorMessage}
          hasError={errors.pages?.hasError}
          ref={pagesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "pages")}
        ></Autocomplete>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}

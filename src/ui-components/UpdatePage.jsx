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
import { listBooks } from "../graphql/queries";
import { createPage } from "../graphql/mutations";
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
export default function UpdatePage(props) {
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
    bookId: undefined,
    bookTitle: "",
    pageId: "",
    recipeStory: "",
    steps: [],
  };
  const [bookId, setBookId] = React.useState(initialValues.bookId);
  const [bookIdLoading, setBookIdLoading] = React.useState(false);
  const [bookIdRecords, setBookIdRecords] = React.useState([]);
  const [selectedBookIdRecords, setSelectedBookIdRecords] = React.useState([]);
  const [bookTitle, setBookTitle] = React.useState(initialValues.bookTitle);
  const [pageId, setPageId] = React.useState(initialValues.pageId);
  const [recipeStory, setRecipeStory] = React.useState(
    initialValues.recipeStory
  );
  const [steps, setSteps] = React.useState(initialValues.steps);
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setBookId(initialValues.bookId);
    setCurrentBookIdValue(undefined);
    setCurrentBookIdDisplayValue("");
    setBookTitle(initialValues.bookTitle);
    setPageId(initialValues.pageId);
    setRecipeStory(initialValues.recipeStory);
    setSteps(initialValues.steps);
    setCurrentStepsValue("");
    setErrors({});
  };
  const [currentBookIdDisplayValue, setCurrentBookIdDisplayValue] =
    React.useState("");
  const [currentBookIdValue, setCurrentBookIdValue] = React.useState(undefined);
  const bookIdRef = React.createRef();
  const [currentStepsValue, setCurrentStepsValue] = React.useState("");
  const stepsRef = React.createRef();
  const getDisplayValue = {
    bookId: (r) => `${r?.title ? r?.title + " - " : ""}${r?.id}`,
  };
  const validations = {
    bookId: [{ type: "Required" }],
    bookTitle: [{ type: "Required" }],
    pageId: [{ type: "Required" }],
    recipeStory: [],
    steps: [],
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
  const fetchBookIdRecords = async (value) => {
    setBookIdLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ title: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listBooks.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listBooks?.items;
      var loaded = result.filter((item) => bookId !== item.id);
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setBookIdRecords(newOptions.slice(0, autocompleteLength));
    setBookIdLoading(false);
  };
  React.useEffect(() => {
    fetchBookIdRecords("");
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
          bookId,
          bookTitle,
          pageId,
          recipeStory,
          steps,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
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
          await client.graphql({
            query: createPage.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
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
      {...getOverrideProps(overrides, "UpdatePage")}
      {...rest}
    >
      <ArrayField
        lengthLimit={1}
        onChange={async (items) => {
          let value = items[0];
          if (onChange) {
            const modelFields = {
              bookId: value,
              bookTitle,
              pageId,
              recipeStory,
              steps,
            };
            const result = onChange(modelFields);
            value = result?.bookId ?? value;
          }
          setBookId(value);
          setCurrentBookIdValue(undefined);
        }}
        currentFieldValue={currentBookIdValue}
        label={"Book id"}
        items={bookId ? [bookId] : []}
        hasError={errors?.bookId?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("bookId", currentBookIdValue)
        }
        errorMessage={errors?.bookId?.errorMessage}
        getBadgeText={(value) =>
          value
            ? getDisplayValue.bookId(
                bookIdRecords.find((r) => r.id === value) ??
                  selectedBookIdRecords.find((r) => r.id === value)
              )
            : ""
        }
        setFieldValue={(value) => {
          setCurrentBookIdDisplayValue(
            value
              ? getDisplayValue.bookId(
                  bookIdRecords.find((r) => r.id === value) ??
                    selectedBookIdRecords.find((r) => r.id === value)
                )
              : ""
          );
          setCurrentBookIdValue(value);
          const selectedRecord = bookIdRecords.find((r) => r.id === value);
          if (selectedRecord) {
            setSelectedBookIdRecords([selectedRecord]);
          }
        }}
        inputFieldRef={bookIdRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Book id"
          isRequired={true}
          isReadOnly={false}
          placeholder="Search Book"
          value={currentBookIdDisplayValue}
          options={bookIdRecords
            .filter(
              (r, i, arr) =>
                arr.findIndex((member) => member?.id === r?.id) === i
            )
            .map((r) => ({
              id: r?.id,
              label: getDisplayValue.bookId?.(r),
            }))}
          isLoading={bookIdLoading}
          onSelect={({ id, label }) => {
            setCurrentBookIdValue(id);
            setCurrentBookIdDisplayValue(label);
            runValidationTasks("bookId", label);
          }}
          onClear={() => {
            setCurrentBookIdDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchBookIdRecords(value);
            if (errors.bookId?.hasError) {
              runValidationTasks("bookId", value);
            }
            setCurrentBookIdDisplayValue(value);
            setCurrentBookIdValue(undefined);
          }}
          onBlur={() => runValidationTasks("bookId", currentBookIdValue)}
          errorMessage={errors.bookId?.errorMessage}
          hasError={errors.bookId?.hasError}
          ref={bookIdRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "bookId")}
        ></Autocomplete>
      </ArrayField>
      <TextField
        label="Book title"
        isRequired={true}
        isReadOnly={false}
        value={bookTitle}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              bookId,
              bookTitle: value,
              pageId,
              recipeStory,
              steps,
            };
            const result = onChange(modelFields);
            value = result?.bookTitle ?? value;
          }
          if (errors.bookTitle?.hasError) {
            runValidationTasks("bookTitle", value);
          }
          setBookTitle(value);
        }}
        onBlur={() => runValidationTasks("bookTitle", bookTitle)}
        errorMessage={errors.bookTitle?.errorMessage}
        hasError={errors.bookTitle?.hasError}
        {...getOverrideProps(overrides, "bookTitle")}
      ></TextField>
      <TextField
        label="Page id"
        isRequired={true}
        isReadOnly={false}
        value={pageId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              bookId,
              bookTitle,
              pageId: value,
              recipeStory,
              steps,
            };
            const result = onChange(modelFields);
            value = result?.pageId ?? value;
          }
          if (errors.pageId?.hasError) {
            runValidationTasks("pageId", value);
          }
          setPageId(value);
        }}
        onBlur={() => runValidationTasks("pageId", pageId)}
        errorMessage={errors.pageId?.errorMessage}
        hasError={errors.pageId?.hasError}
        {...getOverrideProps(overrides, "pageId")}
      ></TextField>
      <TextField
        label="Recipe story"
        isRequired={false}
        isReadOnly={false}
        value={recipeStory}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              bookId,
              bookTitle,
              pageId,
              recipeStory: value,
              steps,
            };
            const result = onChange(modelFields);
            value = result?.recipeStory ?? value;
          }
          if (errors.recipeStory?.hasError) {
            runValidationTasks("recipeStory", value);
          }
          setRecipeStory(value);
        }}
        onBlur={() => runValidationTasks("recipeStory", recipeStory)}
        errorMessage={errors.recipeStory?.errorMessage}
        hasError={errors.recipeStory?.hasError}
        {...getOverrideProps(overrides, "recipeStory")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              bookId,
              bookTitle,
              pageId,
              recipeStory,
              steps: values,
            };
            const result = onChange(modelFields);
            values = result?.steps ?? values;
          }
          setSteps(values);
          setCurrentStepsValue("");
        }}
        currentFieldValue={currentStepsValue}
        label={"Steps"}
        items={steps}
        hasError={errors?.steps?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("steps", currentStepsValue)
        }
        errorMessage={errors?.steps?.errorMessage}
        setFieldValue={setCurrentStepsValue}
        inputFieldRef={stepsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Steps"
          isRequired={false}
          isReadOnly={false}
          value={currentStepsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.steps?.hasError) {
              runValidationTasks("steps", value);
            }
            setCurrentStepsValue(value);
          }}
          onBlur={() => runValidationTasks("steps", currentStepsValue)}
          errorMessage={errors.steps?.errorMessage}
          hasError={errors.steps?.hasError}
          ref={stepsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "steps")}
        ></TextField>
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

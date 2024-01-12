export function convertModuleNameIntoOtherName(moduleName) {
  let inputValue = moduleName.replace(/[-\s]([a-z])/g, (_, match) =>
    match.toUpperCase()
  );
  let input_value = moduleName.toLowerCase().replace(/ /g, '-');
  let INPUT_VALUE = moduleName.toUpperCase().replace(/[-_\s]/g, '_');
  let InputValue = moduleName.replace(/(?:^| |-)([a-z])/g, (_, match) =>
    match.toUpperCase()
  );

  return {
    inputValue,
    input_value,
    INPUT_VALUE,
    InputValue
  };
}

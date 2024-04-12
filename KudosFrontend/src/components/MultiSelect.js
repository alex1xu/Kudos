import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const MultiSelect = (props) => {
  if (props.allowSelectAll) {
    return (
      <Select
        {...props}
        options={[props.allOption, ...props.options]}
        onChange={(selected) => {
          if (
            selected !== null &&
            selected.length > 0 &&
            selected[selected.length - 1].value === props.allOption.value
          ) {
            return props.onChange(props.options);
          }
          return props.onChange(selected);
        }}
      />
    );
  }

  return <Select {...props} />;
};

MultiSelect.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
};

MultiSelect.defaultProps = {
  allOption: {
    label: "Select all",
    value: "*",
  },
};

export default MultiSelect;

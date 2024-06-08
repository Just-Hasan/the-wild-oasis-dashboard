import PropTypes from "prop-types";
import Select from "./Select";
import { useSearchParams } from "react-router-dom";

export default function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }
  const sortBy = searchParams.get("sortBy") || "";
  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      sortBy={sortBy}
    />
  );
}

SortBy.propTypes = {
  sortField: PropTypes.string,
  options: PropTypes.array,
};

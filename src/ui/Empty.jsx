import PropTypes from "prop-types";

export default function Empty({ resource }) {
  return <p>No {resource} could be found.</p>;
}

Empty.propTypes = {
  resource: PropTypes.string,
};

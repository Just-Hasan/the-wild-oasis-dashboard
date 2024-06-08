import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) => {
    return (
      props.active === "true" &&
      css`
        background-color: var(--color-brand-600);
        color: var(--color-brand-50);
      `
    );
  }}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

export default function Filter({ filteredField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleClick(value) {
    searchParams.set(filteredField, value);
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  }
  const currentFilter = searchParams.get(filteredField) || options[0].value;
  return (
    <StyledFilter>
      {options.map((option) => {
        const activeFilterButton = currentFilter === option.value;
        return (
          <FilterButton
            active={String(activeFilterButton)}
            disabled={currentFilter === option.value}
            key={option.value}
            onClick={() => handleClick(option.value)}
          >
            {option.label}
          </FilterButton>
        );
      })}
    </StyledFilter>
  );
}

Filter.propTypes = {
  filteredField: PropTypes.string,
  options: PropTypes.array,
};

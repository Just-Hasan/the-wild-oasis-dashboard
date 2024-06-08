import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";
import PropTypes from "prop-types";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

export default function ConfirmDelete({
  resourceName,
  onConfirm,
  onClose,
  disabled,
}) {
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName.name}</Heading>
      <p>
        Are you sure you want to delete this {resourceName.name} permanently?
        This action cannot be undone.
      </p>
      <div>
        <Button variations="secondary" disabled={disabled} onClick={onClose}>
          Cancel
        </Button>
        <Button variations="danger" disabled={disabled} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

ConfirmDelete.propTypes = {
  resourceName: PropTypes.object,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  disabled: PropTypes.any,
};

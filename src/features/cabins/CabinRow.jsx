import styled from "styled-components";
import PropTypes from "prop-types";
import CreateCabinForm from "./CreateCabinForm";
import { formatCurrency } from "../../utils/helpers";
import { useDeleteCabin } from "./useDeleteCabin";
import { useCreateCabin } from "./useCreateCabin";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

export default function CabinRow({ cabin }) {
  // const { isCreating, createCabin } = useCreateCabin();
  const { createCabin } = useCreateCabin();

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    description,
    image,
  } = cabin;

  const { isDeleting, deleteCabin } = useDeleteCabin();
  return (
    <Table.Row>
      <Img src={image}></Img>
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinId} />
            <Menus.List id={cabinId}>
              <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={() => {
                  createCabin({
                    name: `Copy of ${name}`,
                    maxCapacity,
                    regularPrice,
                    discount,
                    description,
                    image,
                  });
                }}
              >
                Duplicate
              </Menus.Button>
              {/* Edit Cabin */}
              <Modal.Open
                opens="edit-cabin"
                renderButton={(open) => (
                  <Menus.Button icon={<HiPencil />} onClick={open}>
                    Edit
                  </Menus.Button>
                )}
              />

              {/*
                Delete Cabin 
                In the Modal.Open button we render the Menus.Button
              */}

              <Modal.Open
                renderButton={(openDeletionModal) => (
                  <Menus.Button icon={<HiTrash />} onClick={openDeletionModal}>
                    Delete
                  </Menus.Button>
                )}
                opens="delete-cabin"
              />
            </Menus.List>

            <Modal.Window
              name="edit-cabin"
              renderForm={(close) => (
                <CreateCabinForm onCloseModal={close} cabinToEdit={cabin} />
              )}
            />

            <Modal.Window
              name="delete-cabin"
              renderForm={(close) => (
                <ConfirmDelete
                  resourceName={cabin}
                  onConfirm={() => deleteCabin(cabinId)}
                  onClose={() => close()}
                  disabled={isDeleting}
                />
              )}
            />
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

CabinRow.propTypes = {
  cabin: PropTypes.object,
};

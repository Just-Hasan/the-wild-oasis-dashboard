import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";

// export default function AddCabin() {
//   const [isOpenModal, setIsOpenModal] = useState(false);
//   return (
//     <div>
//       <Button onClick={() => setIsOpenModal((showForm) => !showForm)}>
//         Add new cabin
//       </Button>

//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal(false)}>
//           <CreateCabinForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

export default function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.Open
          opens="cabin-form"
          /*
        /////////////////////////////////////[Render Prop In Action]
        1. renderButton is a prop containing a function that receives
        one paramater and return a Button component with the onClick,
        that trigger or invoke the open paramater
        */
          renderButton={(open) => <Button onClick={open}>Add new cabin</Button>}
        ></Modal.Open>

        <Modal.Window
          name="cabin-form"
          renderForm={(close) => <CreateCabinForm onCloseModal={close} />}
        />

        {/* <Modal.Open opens="table">
        <Button>Show tables</Button>
        </Modal.Open>
        <Modal.Window name="table">
        <CreateCabinForm />
      </Modal.Window> */}
      </Modal>
    </div>
  );
}

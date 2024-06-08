import { useCallback, useEffect, useRef } from "react";
//handler is the close function to close the modal
export default function useCloseModal(handler, listenCapturing) {
  const ref = useRef();
  /*
  /////////////////////////////////////[Logic behind detecting click outside of the modal]
  1. let's just say we have an overlay and a modal, and we wanna close the modal when we click on
  the overlay, but the overlay is outside of the modal
  2. we can achive the functionalities by using the ref on the modal
  3. then we can write a logic like below
  */
  const handleClick = useCallback(
    // e = event of the target (the overlay we're gonna click to close the modal)
    // ref.current = should  be the modal to show
    function (e) {
      if (
        // ref.current && = is to check whether our targeted element exist or not
        ref.current &&
        /*
        Below is the core heart logic of the functionalities :
        if I put it into words, it'd be like, if the ref.current (modal)
        DOESN'T contain the e.target (element that we click = overlay) then close the modal

        Why it doesn't contain the e.target(stuff that we click) because the overlay is outside of
        the modal, so the overlay is impossible in the modal
        */
        !ref.current.contains(e.target)
      ) {
        handler();
      }
    },
    [handler]
  );
  //true = bubbling, false = capturing
  useEffect(() => {
    document.addEventListener("click", handleClick, listenCapturing);
    return document.removeEventListener("click", handleClick, listenCapturing);
  }, [handleClick, listenCapturing]);

  return ref;
}

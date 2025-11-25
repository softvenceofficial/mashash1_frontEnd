import { useSearchParams } from "react-router";
import Modal from "./modal";

export default function useModal() {
  const [searchParams, setSearchParams] = useSearchParams();

  const close = (modalId: string) => {
    searchParams.delete(modalId);
    setSearchParams(searchParams);
  };

  return { close, Modal };
}

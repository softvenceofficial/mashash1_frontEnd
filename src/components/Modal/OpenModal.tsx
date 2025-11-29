import type { PropsWithChildren } from "react";
import { useSearchParams } from "react-router";

type Query = {
  openId: string;
  modalId: string;
};
interface OpenModalProps {
  query: Query[];
  className?: string;
}

export default function OpenModal({
  query,
  children,
  className,
}: PropsWithChildren<OpenModalProps>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleModalOpen = () => {
    query.forEach(({ modalId, openId }) => searchParams.set(modalId, openId));
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <span onClick={handleModalOpen} className={className}>
      {children}
    </span>
  );
}

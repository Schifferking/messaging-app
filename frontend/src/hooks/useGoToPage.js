import { useNavigate } from "react-router-dom";

export function useGoToPage() {
  const navigate = useNavigate();
  const goToPage = (page, replace = false) => {
    navigate(`../${page}`, { replace: replace });
  };

  return goToPage;
}

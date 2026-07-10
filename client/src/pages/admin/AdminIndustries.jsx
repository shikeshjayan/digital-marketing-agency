import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import CategoryManagement from "../../components/admin/CategoryManagement.jsx";
import useIndustryStore from "../../store/industryStore.js";

export default function AdminIndustries() {
  return (
    <CategoryManagement
      config={{
        icon: faBuilding,
        label: "Industry",
        labelPlural: "Industries",
        useStore: useIndustryStore,
        fetchKey: "fetchAdminIndustries",
        createKey: "createIndustry",
        updateKey: "updateIndustry",
        deleteKey: "deleteIndustry",
        deleteAllKey: "deleteAllIndustries",
        searchPlaceholder: "Search by industry name...",
      }}
    />
  );
}

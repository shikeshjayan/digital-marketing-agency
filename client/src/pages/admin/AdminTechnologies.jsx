import { faMicrochip } from "@fortawesome/free-solid-svg-icons";
import CategoryManagement from "../../components/admin/CategoryManagement.jsx";
import useTechnologyStore from "../../store/technologyStore.js";

export default function AdminTechnologies() {
  return (
    <CategoryManagement
      config={{
        icon: faMicrochip,
        label: "Technology",
        labelPlural: "Technologies",
        useStore: useTechnologyStore,
        fetchKey: "fetchAdminTechnologies",
        createKey: "createTechnology",
        updateKey: "updateTechnology",
        deleteKey: "deleteTechnology",
        deleteAllKey: "deleteAllTechnologies",
        searchPlaceholder: "Search by technology name...",
      }}
    />
  );
}

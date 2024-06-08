import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useGetCabins } from "./useGetCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

export default function CabinTable() {
  const { isLoading, cabins } = useGetCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  // Filter
  const filter = searchParams.get("discount") || "all";
  let filteredCabins;
  if (filter === "all") {
    filteredCabins = cabins;
  } else if (filter === "no-discount") {
    filteredCabins = cabins.slice().filter((cabin) => cabin.discount === 0);
  } else if (filter === "with-discount") {
    filteredCabins = cabins.slice().filter((cabin) => cabin.discount > 0);
  }

  // Sort
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [sortType, order] = sortBy.split("-");
  const modifier = order === "asc" ? 1 : -1;
  let sortedCabins;
  if (sortType === "name" && order === "asc") {
    sortedCabins = filteredCabins.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "name" && order === "desc") {
    sortedCabins = filteredCabins.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    sortedCabins = filteredCabins.sort(
      (a, b) => (a[sortType] - b[sortType]) * modifier
    );
    return sortedCabins;
  }

  if (!filteredCabins.length) return <Empty resource="Cabin" />;

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header role="row">
          <div></div>
          <div>Cabins</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={filteredCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
}

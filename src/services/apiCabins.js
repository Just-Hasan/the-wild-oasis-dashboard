import supabase from "./supabase";
import { supabaseUrl } from "./supabase";
import { v4 as RandomId } from "uuid";

export async function getCabins() {
  const { data: cabins, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error.message);
    throw new Error("Cabins couldn't be found");
  }

  return cabins;
}

export async function createEditCabin(newCabinObj, id) {
  const hasImagePath = newCabinObj.image?.startsWith?.(supabaseUrl);
  console.log(id);
  const imageName = `${RandomId()}-${newCabinObj.image.name}`.replaceAll(
    "/",
    ""
  );

  // Path mengambil image di bucket cabin-images
  const imagePath = hasImagePath
    ? newCabinObj.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create cabin
  let query = supabase.from("cabins");

  // creating cabin
  if (!id) {
    query = query.insert([{ ...newCabinObj, image: imagePath }]);
  }

  // Update Cabin
  if (id) {
    query = query
      .update({ ...newCabinObj, id: id, image: imagePath })
      .eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error("Can't create cabin");
  }

  // 2 Upload image (mengupload image sesungguhnya ke bucket)
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabinObj.image, {
      cacheControl: "3600",
      upsert: false,
    });

  // 3. Delete the cabin if there was an error uploading the corresponding image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.log(error);
    throw new Error(
      "Cabin image couldn't be uploaded, and the process of creating the cabin is terminated"
    );
  }
  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}

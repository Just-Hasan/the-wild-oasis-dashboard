import supabase, { supabaseUrl } from "./supabase";
import { v4 as RandomId } from "uuid";
export async function signup({ fullName, email, password }) {
  const { data, errors } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  if (errors) throw new Error(errors.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);

  // this returns user's data and session
  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// This function updates the current user's information, including password, fullName, and avatar.
export async function updateCurrentUser({ password, fullName, avatar }) {
  // Initialize updateData as an empty object to store the fields that need to be updated.
  let updateData = {};

  // If a password is provided, add it to the updateData object.
  if (password) {
    updateData.password = password;
  }

  // If a fullName is provided, add it to the updateData object within a nested data object.
  if (fullName) {
    updateData.data = { fullName };
  }

  // 1. Update password or fullName using Supabase's updateUser method.
  // The method returns an object with data and error properties.
  const { data, error } = await supabase.auth.updateUser(updateData);

  // If there's an error updating the user, throw an error with the error message.
  if (error) throw new Error(error.message);

  // If no avatar is provided, return the data from the previous update operation.
  if (!avatar) return data;

  // 2. Upload the avatar image to Supabase storage.
  // Generate a unique file name for the avatar using the user's ID and a random ID.
  const fileName = `avatar-${data.user.id}-${RandomId()}`;
  console.log(fileName, avatar);

  // Attempt to upload the avatar image to the 'avatars' storage bucket.
  // The method returns an object with an error property if the upload fails.
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  // If there's an error uploading the avatar, throw an error with the storage error message.
  if (storageError) throw new Error(storageError.message);

  // 3. Update the user's avatar URL in their profile.
  // Construct the public URL for the uploaded avatar.
  const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;

  // Update the user's profile with the new avatar URL using Supabase's updateUser method.
  // The method returns an object with data and error properties.
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: { avatar: avatarUrl },
  });

  // If there's an error updating the user's avatar URL, throw an error with the error message.
  if (error2) throw new Error(error2.message);

  // Return the updated user data.
  return updatedUser;
}

// This function updates the current user's information, including password, fullName, and avatar.
export async function updateCurrentUser_ERROR_EXIST_ONLY_FOR_REFERENCE({
  password,
  fullName,
  avatar,
}) {
  // Potential error: `updateData` is not initialized, which could cause issues if neither `password` nor `fullName` is provided.
  let updateData;

  // If a password is provided, it sets the updateData to an object containing the password.
  if (password) {
    updateData = { password };
  }

  // If a fullName is provided, it overwrites the updateData with an object containing the fullName in data.
  // Potential issue: This overwrites any existing `updateData` set in the previous block.
  if (fullName) {
    updateData = { data: { fullName } };
  }

  // 1. Update password OR fullName using Supabase's updateUser method.
  // supabase is not await although we're currently in an async function and supabase is an async operations
  const { data, error } = supabase.auth.updateUser(updateData);

  // If there's an error updating the user, throw an error with the message.
  if (error) throw new Error(error.message);

  // If no avatar is provided, return the data from the previous update operation.
  if (!avatar) return data;

  // 2. Upload the avatar image to Supabase storage.
  const fileName = `avatar-${data.user.id}-${RandomId()}`; // Generate a unique file name using user ID and a random ID.
  console.log(fileName, avatar);

  // Attempt to upload the avatar image to the 'avatars' bucket.
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  // Potential error: Incorrect error message reference.
  // Should be `storageError.message` to provide accurate error information if the upload fails.
  if (storageError) throw new Error(error.message);

  // 3. Update the user's avatar URL in their profile.
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`, // Construct the public URL for the uploaded avatar.
    },
  });

  // If there's an error updating the user's avatar URL, throw an error with the message.
  if (error2) throw new Error(error2.message);

  // Return the updated user data.
  return updatedUser;
}

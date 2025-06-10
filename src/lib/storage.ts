import { supabase } from '@/integrations/supabase/client';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-pictures')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const fileName = fileUrl.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from('profile-pictures')
    .remove([fileName]);

  if (error) {
    console.error('Gagal menghapus file:', error);
  }
};

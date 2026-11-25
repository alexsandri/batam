// Menampilkan pesan validasi pertama dari Laravel untuk satu field
export default function FieldError({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <p className="mt-1 text-xs text-red-600">
      {errors[0]}
    </p>
  );
}

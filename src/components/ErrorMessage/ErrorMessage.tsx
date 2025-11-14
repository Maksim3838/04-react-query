interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p style={{ color: "red", textAlign: "center" }}>
      {message}
    </p>
  );
}

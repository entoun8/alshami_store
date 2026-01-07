import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-bold text-foreground"
    >
      <Image
        src="/images/logo.svg"
        alt="Alshami Logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-full"
      />
      Alshami
    </Link>
  );
}

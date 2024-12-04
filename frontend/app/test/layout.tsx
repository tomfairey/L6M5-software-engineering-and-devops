import NavigationBar from "@/components/Navigation/NavigationBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <NavigationBar items={[]} />
    </>
  );
}

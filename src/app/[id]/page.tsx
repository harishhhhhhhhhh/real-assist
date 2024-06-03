import Main from "@/components/main";

export default function Page({ params }: { params: { id: string } }) {
  return <Main params={params}/>
}

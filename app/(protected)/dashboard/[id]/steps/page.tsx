"use client"

import { useParams } from 'next/navigation';

const page = () => {
  const params = useParams();
  const demoId = params.id as string;

  return (
    <main >page</main>
  )
}

export default page
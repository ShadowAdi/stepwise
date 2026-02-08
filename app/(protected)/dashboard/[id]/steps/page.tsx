"use client"

import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
  const params = useParams();
  const demoId = params.id as string;

  return (
    <div>page</div>
  )
}

export default page
import { NextResponse } from 'next/server';
//http://localhost:8056/items/articles?fields=id%2Ctitle%2Ccontent%2Cdate_created&sort=-date_created&limit=50
export async function GET() {
  const res = await fetch('http://localhost:8056/items/articles');
  const data = await res.json();
  console.log('data ==> ' , data)
  return NextResponse.json(data);
}
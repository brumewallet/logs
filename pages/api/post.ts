// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.query.ip as string

  if (!ip) {
    res.status(400).send(undefined)
    return
  }

  const { method, tor } = req.body

  const { data, error } = await supabase
    .from("requests")
    .insert({ ip, method, tor })

  if (error)
    res.status(200).json({ error })
  else
    res.status(200).json({ data })
}

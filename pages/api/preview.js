import * as contentful from "../../utils/contentful"
import { COOKIE_NAME_PRERENDER_BYPASS } from 'next/dist/server/api-utils';


export default async function handler(req, res) {
  const { secret, code } = req.query
  console.log("question code: ", code)
  console.log("secret: ", secret)

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !code) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const question = await contentful.client
    .getEntries({
      content_type: 'multiplesChoiceQuestion',
      limit: 1,
      "fields.code": code,
    })


  if (!question.items.length) {
    return res.status(401).json({ message: 'Invalid question code' })
  }

  const pageFields = question.items[0].fields
  // console.log(pageFields)

  res.setPreviewData({})
  res.redirect(`/question/${pageFields.code}`)
}

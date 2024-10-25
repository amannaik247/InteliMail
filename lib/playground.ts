import {create, insert, search, type AnyOrama} from '@orama/orama'
import {db} from './server/db'
import { threadId } from 'worker_threads'

const orama = await create({
    schema: {
        title: "string",
        body: "string",
        rawBody: "string",
        from: 'string',
        to: 'string[]',
        sentAt: 'string',
        // embeddings: 'vector[1536]',
        threadId: 'string'
    },
})

const emails = await db.email.findMany({
    select:{
        subject:true,
        body:true,
        from:true,
        to:true,
        sentAt:true,
        threadId:true,
    }
})

for (const email of emails) {
    console.log(emails.subject)
    // @ts-ignore
    await insert(orama, {
        subject: email.subject,
        body:email.body,
        from:email.from.address,
        to:email.to.map(to => to.address),
        sentAt:email.sentAt.toLocaleString(),
        threadId:email.threadId,
    })
}

const searchResults = await search(orama, {
    term:"cascading"
})
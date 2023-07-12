import React, { useEffect, useState } from "react"
import { Button, Input } from 'antd'
const { Configuration, OpenAIApi } = require("openai")

const { TextArea } = Input
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'th-Th'

const configuration = new Configuration({
    apiKey: "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",
})
const openai = new OpenAIApi(configuration)

const Main = () => {
    const [isListening, setIsListening] = useState(false)
    const [note, setNote] = useState('')
    const [text, setText] = useState('')

    useEffect(() => {
        mic.onstart = () => {
            console.log('Speech recognition started')
        }

        mic.onresult = async e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
            setText(transcript)

            // setText(e.target.value)
            const question = e.target.value
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `q: ${question}\n a: `,
                temperature: 0,
                max_tokens: 100,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                stop: ["\n"],
            })
            setNote(response.data.choices?.[0].text)
            // console.log(response)
        }

        mic.onerror = event => {
            console.error('Speech recognition error:', event.error)
        }

    }, [])

    const startListening = () => {
        setIsListening(true)
        mic.start()
    }

    const stopListening = () => {
        setIsListening(false)
        mic.stop()
    }

    // const handleInputChange = async e => {
    //     setText(e.target.value)
    //     const question = e.target.value
    //     const response = await openai.createCompletion({
    //         model: "text-davinci-003",
    //         prompt: `q: ${question}\n a: `,
    //         temperature: 0,
    //         max_tokens: 100,
    //         top_p: 1,
    //         frequency_penalty: 0.0,
    //         presence_penalty: 0.0,
    //         stop: ["\n"],
    //     })
    //     setNote(response.data.choices?.[0].text)
    // }

    return (
        <>
            <br /><br />
            <div>
                <Button onClick={startListening} disabled={isListening}>
                    Start Listening
                </Button>
                <Button onClick={stopListening} disabled={!isListening}>
                    Stop Listening
                </Button>
            </div>
            <br /><br />
            <Input type="text" id="inputText" placeholder="Questions" value={text} />
            <br /><br />
            <TextArea id="outputText" placeholder="Answers" value={note} />
        </>
    )
}

export default Main

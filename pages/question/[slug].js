import {useState} from "react";
import PreviewBanner from "../../components/PreviewBanner"
import * as contentful from "../../utils/contentful"
import {Box, Button, Center, Container, Icon, Radio, RadioGroup, Stack} from '@chakra-ui/react'
import {FcIdea} from 'react-icons/fc'


const questionStyle = {
    textAlign: 'center', marginTop: '50px'
};
'use client'
export default function ProductPage(props) {

    //const props = useContentfulLiveUpdates(props)
    // if (props.error) {
    //     return (<div>
    //         <h1>An Error occurred: </h1>
    //         <h2>{props.error}</h2>
    //     </div>)
    // }
    const [result, newResult] = useState('')

    function updateResult(choice) {
        newResult(choice.choiceFeedback)
    }

    const choices = props.choices
    const [selectedValue, setSelectedValue] = useState("{}")
    const [choiceColorMapping, setChoiceColorMapping] = useState(choices.map(choice => {
        return {
            choiceText: choice.choiceText, choiceColor: 'white'
        }
    }))



    function isCorrect() {
        const selectedChoice = JSON.parse(selectedValue)
        let isCorrectChoice = selectedChoice.isCorrectChoice;

        if (isCorrectChoice === false) {
            let correctChoice = choices.find((choice) => choice.choiceText === selectedChoice.choiceText);
            let newChoiceColorMap = choiceColorMapping.map(it => ({
                ...it,
                choiceColor: it.choiceText === correctChoice.choiceText ? 'red' : 'white'
            }));
            setChoiceColorMapping(newChoiceColorMap)
            updateResult(selectedChoice)
        }
        if (isCorrectChoice === true) {
            let correctChoice = choices.find((choice) => choice.choiceText === selectedChoice.choiceText);
            let newChoiceColorMap = choiceColorMapping.map(it => ({
                ...it,
                choiceColor: it.choiceText === correctChoice.choiceText ? 'green' : 'white'
            }));
            setChoiceColorMapping(newChoiceColorMap)
            updateResult(selectedChoice)
        }
    }

    return (<div style={questionStyle}>
        {props.preview && <PreviewBanner/>}
        {props.prompt.map((item) => (<Container key={item}>{item.content.map(c => c.value)}</Container>
            //<h2 key={item} style={questionStyle}>{item.content.map(c => c.value)}</h2>
        ))}
        <Center marginTop={20}>
            <RadioGroup onChange={setSelectedValue} value={selectedValue}>
                <Stack direction='row'>
                    {props.choices.map(choice => (
                        <Box display="inline-block" borderRadius="lg"
                             transition="border 0.3s ease-in-out" // Smooth transition for the border
                             _hover={{
                                 border: "1px solid black", // Border style on hover
                             }}
                            bg={choiceColorMapping.find((c) => c.choiceText === choice.choiceText).choiceColor}
                             key={choice.choiceText}><Radio
                            value={JSON.stringify(choice)}>{choice.choiceText}</Radio></Box>))}
                </Stack>
            </RadioGroup>
        </Center>
        <Center><Button onClick={() => isCorrect()} colorScheme='blue' marginTop={7}>Submit Answer</Button></Center>
        {/*<h3>{value}</h3>*/}
        <div style={{display: result==='' ? 'none': 'block'}}>
            <Box display="inline-block" marginTop={7} border="1px solid black" borderRadius="lg"><Icon as={FcIdea} w={7} h={7}/>{result}</Box>
        </div>

    </div>)
}

export async function getStaticPaths() {
    const question = await contentful.client
        .getEntries({
            content_type: 'multiplesChoiceQuestion',
        })

    const paths = question.items.map(q => ({
        params: {
            slug: q.fields.code
        }
    }))

    return {
        fallback: false, paths,
    }
}

export async function getStaticProps(context) {
    // console.log("context: ", context)
    // Get data from headless CMS
    // const client = context.preview
    //   ? contentful.previewClient
    //   : contentful.client

    const question = await contentful.previewClient
        .getEntries({
            content_type: 'multiplesChoiceQuestion', limit: 1, "fields.code": context.params.slug,
        })

    const choices = question.items[0].fields.choices.choices;

    return {
        props: {
            preview: context.preview || false,
            error: !question.items.length && `No question with id: ${context.params.slug}`,
            code: question.items[0].fields.code,
            prompt: question.items[0].fields.questionPrompt.content,
            choices,
        },
    }
}

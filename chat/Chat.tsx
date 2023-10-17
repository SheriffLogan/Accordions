import { useRef, useState, useEffect } from "react";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton, List } from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";
import { ChatFilled } from "@fluentui/react-icons";
import axios from 'axios';

import styles from "./Chat.module.css";

import { chatApi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { Example, ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";
import ActiveHistory from "../../components/History/ActiveHistory";

interface FetchedData {
    PartitionKey: string;
    RowKey: string;
    Logs: string;
    Timestamp: string;
}

type Convo = [user: string, bot: AskResponse]

const Chat = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState<string>("");
    const [retrieveCount, setRetrieveCount] = useState<number>(3);
    const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
    const [excludeCategory, setExcludeCategory] = useState<string>("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(false);
    const [NoImage, setNoImage] = useState<boolean>(false);
    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [activeCitation, setActiveCitation] = useState<string>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);
    const date = new Date();
    const formatedate = date.toISOString();
    const minutes = String(date.getMinutes());

    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [lastRowKey, setLastRowKey] = useState("");
    const [fetchedData, setFetchedData] = useState<FetchedData[]>([]);

    // const postApi = async () => {
    //     try {

    //         const singleString: string = chatHistory.join(",");
    //         const singleStringLog = `{"${singleString}"}`;
    //         console.log(lastRowKey)

    //         var raw = {
    //             PartitionKey: "176856",
    //             RowKey: generateRowKey(lastRowKey),
    //             Logs: singleStringLog,
    //             UserId: "user@example.com"
    //         };
    //         console.log(raw)
    //         console.log(singleStringLog);
    //         const response = await fetch(" https://stk3psfo35musj6.table.core.windows.net/Chatlogs?sv=2019-02-02&st=2023-08-28T13%3A02%3A06Z&se=2025-08-29T13%3A02%3A00Z&sp=raud&sig=MxUk4XoiSebJ6ei5I4%2BC%2B81mf4bhnB2%2FqsuZCqQYQSk%3D&tn=Chatlogs", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(raw),
    //         });
    //         if (!response.ok) {

    //             throw new Error("API request failed");
    //         }
    //         if (response.ok) {
    //             console.log("api called")
    //         }
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }

    const makeApiRequest = async (question: string) => {
        console.log(question)
        setNoImage(true);
        lastQuestionRef.current = question;
        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

        try {

            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [...history, { user: question, bot: undefined }],
                approach: Approaches.ReadRetrieveRead,
                overrides: {
                    promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    semanticRanker: useSemanticRanker,
                    semanticCaptions: useSemanticCaptions,
                    suggestFollowupQuestions: useSuggestFollowupQuestions
                }
            };
            const result = await chatApi(request);
            setAnswers([...answers, [question, result]]);
            console.log("how to set answers", answers);
            console.log("string " + history)
            console.log(history)

            const log = {
                U: question,
                C: result.answer
            };
            const logString = `'U':'${log.U}','C':'${log.C}'`;
            setChatHistory([...chatHistory, logString]);


        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get_chathistory/51159', {
            });
            const data = response.data;
            console.log('value of data is', data);
            // setFetchedData(data.value);
            // const lastRow = data.value[data.value.length - 1];
            // setLastRowKey(lastRow.RowKey)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const clearChat = () => {
        // console.log(chatHistory)
        // postApi()
        setNoImage(false);
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
        console.log(newValue)
    };

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onUseSemanticRankerChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticCaptions(!!checked);
    };

    const onExcludeCategoryChanged = (_ev?: React.FormEvent, newValue?: string) => {
        setExcludeCategory(newValue || "");
        console.log(newValue)
    };

    const onUseSuggestFollowupQuestionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
    };

    const onShowCitation = (citation: string, index: number) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    const generateRowKey = (currentRowKey: string): string => {
        // Assuming RowKey is numeric, you can increment it by 1
        const newRowKey = (parseInt(currentRowKey) + 1).toString();
        return newRowKey;
    };

    const generatePartitionKey = (currentPartitionKey: string): string => {
        // Assuming PartitionKey is numeric, you can increment it by 1
        const newPartitionKey = (parseInt(currentPartitionKey) + 1).toString();
        return newPartitionKey;
    };

    const onClickFunction1 = () => {
        clearChat();
    }

    const handleButtonClick = () => {
        onClickFunction1();

    };

    const LoadHistory = (history: string) => {
        setNoImage(true);
        error && setError(undefined);
        // setIsLoading(true);
        setActiveCitation(undefined);
        // setActiveAnalysisPanelTab(undefined);

        try {

            const regex = /'U':'([^']*)','C':'([^']*)'/g;
            const matches = [...history.matchAll(regex)];
            // lastQuestionRef.current = "asdadasdadas"
            // Handle the input with 'U' and 'C' properties
            const conversation: Convo[] = matches.map(match => ([
                match[1],
                {
                    answer: match[2],
                    thoughts: "",
                    data_points: [],
                    error: ""
                },
            ]));
            setAnswers(conversation);


            <div className={styles.chatContainer1}>
                <div className={styles.chatMessageStream}>
                    {conversation.map((conv, index) => (
                        <div key={index}>
                            <>{lastQuestionRef.current = conv[0]}</>
                            <UserChatMessage message={conv[0]} />
                            <div className={styles.chatMessageGpt}>
                                <Answer
                                    key={index}
                                    answer={conv[1]}
                                    isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                    onCitationClicked={c => onShowCitation(c, index)}
                                    onThoughtProcessClicked={() => null}
                                    onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                    onFollowupQuestionClicked={q => makeApiRequest(q)}
                                    showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.chatRoot}>
                <div className={NoImage ? styles.chatContainer2 : styles.chatContainer1}>
                    {NoImage && (
                        <div className={styles.commandsContainer} style={{ paddingTop: "5%" }}>
                            <ClearChatButton className={styles.commandButton} onClick={handleButtonClick} disabled={!lastQuestionRef.current || isLoading} />
                            {/* <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} /> */}
                        </div>
                    )}
                    {!lastQuestionRef.current ? (
                        <>
                            <div className={styles.chatEmptyState}>
                                {/* <ChatFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}
                                <img style={{ height: "180px", width: "210px" }} src="TensaiMascotNew.png" alt="Welcome Image" />
                                <h2 style={{ fontSize: "2.5vw" }} className={styles.chatEmptyStateTitle}>
                                    Explore Tenjin's Generative AI
                                </h2>
                                <h3 style={{ color: "#C83700", fontSize: "1.5vw" }} className={styles.chatEmptyStateSubtitle}>
                                    Ask anything or try an example
                                </h3>
                            </div>
                            <div className={styles.chatInput}>
                                <QuestionInput
                                    clearOnSend
                                    placeholder="Type a new question (e.g. What is Tensai?)"
                                    disabled={isLoading}
                                    onSend={question => makeApiRequest(question)}
                                    bgColor="#ffffff"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.chatMessageStream}>
                                {answers.map((answer, index) => (
                                    <div key={index}>
                                        <UserChatMessage message={answer[0]} />
                                        <div className={styles.chatMessageGpt}>
                                            <Answer
                                                key={index}
                                                answer={answer[1]}
                                                isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                                onCitationClicked={c => onShowCitation(c, index)}
                                                onThoughtProcessClicked={() => null}
                                                onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                                onFollowupQuestionClicked={q => makeApiRequest(q)}
                                                showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <>
                                        <UserChatMessage message={lastQuestionRef.current} />
                                        <div className={styles.chatMessageGptMinWidth}>
                                            <AnswerLoading />
                                        </div>
                                    </>
                                )}
                                {error ? (
                                    <>
                                        <UserChatMessage message={lastQuestionRef.current} />
                                        <div className={styles.chatMessageGptMinWidth}>
                                            <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                        </div>
                                    </>
                                ) : null}
                                <div ref={chatMessageStreamEnd} />
                            </div>
                            {/* <div className={styles.chatInput}> */}
                            <div style={{ width: "100%" }}>
                                <QuestionInput
                                    clearOnSend
                                    placeholder="Type a new question (e.g. What is Tensai?)"
                                    disabled={isLoading}
                                    onSend={question => makeApiRequest(question)}
                                    bgColor="#f2f2f2"
                                />
                            </div>
                            {/* </div> */}
                        </>
                    )}

                    {/* <div className={styles.chatInput}>
                        <QuestionInput
                            clearOnSend
                            placeholder="Type a new question (e.g. What is Tensai?)"
                            disabled={isLoading}
                            
                            onSend={
                               
                                question => makeApiRequest(question)}
                        />
                    </div> */}
                </div>

                {answers.length > 0 && activeAnalysisPanelTab && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="70vh"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                    />
                )}

                <Panel
                    headerText="Configure answer generation"
                    isOpen={isConfigPanelOpen}
                    isBlocking={false}
                    onDismiss={() => setIsConfigPanelOpen(false)}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
                    isFooterAtBottom={true}
                >
                    <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={promptTemplate}
                        label="Override prompt template"
                        multiline
                        autoAdjustHeight
                        onChange={onPromptTemplateChange}
                    />

                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label="Retrieve this many documents from search:"
                        min={1}
                        max={50}
                        defaultValue={retrieveCount.toString()}
                        onChange={onRetrieveCountChange}
                    />
                    <TextField className={styles.chatSettingsSeparator} label="Exclude category" onChange={onExcludeCategoryChanged} />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticRanker}
                        label="Use semantic ranker for retrieval"
                        onChange={onUseSemanticRankerChange}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticCaptions}
                        label="Use query-contextual summaries instead of whole documents"
                        onChange={onUseSemanticCaptionsChange}
                        disabled={!useSemanticRanker}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSuggestFollowupQuestions}
                        label="Suggest follow-up questions"
                        onChange={onUseSuggestFollowupQuestionsChange}
                    />
                </Panel>
            </div>
            {/* {!NoImage && <img style={{ height: "100%", width: "100%", paddingLeft: "11%", paddingRight: "11%" }} src="pic.PNG" alt="paper image" />} */}
            <div style={{ marginBottom: "20px" }}>
                {!NoImage && <ActiveHistory LoadHistory={LoadHistory} />}

            </div>

        </div>
    );
};

export default Chat;

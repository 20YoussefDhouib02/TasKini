import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  }  from "@google/generative-ai";
  
  const apiKey = "AIzaSyAno9B_nITw_JRai5EMlp0QadSMH_QnYCw";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [/*
        {
            role:"user",
            parts:[
                {text: "you are chat assistant for to do list website, you are used to help users organize and how to do their tasks. If a user asks any unrelated topics tell him that you cannot help him "}
            ],
        },
        {
            role: "model",
            parts:[
                {text :"Okay, I'm ready to help you organize your tasks."}
            ],
        }*/
      ],
    });
  
    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
    return result.response.text()
  }

  const chatbot = async(req,res) =>{
    try {
      const{prompt} = req.body;
      const response=await run(prompt);
      return res.json(response);
    }
    catch (error){
        console.log(error);
    }
  };
export default chatbot;
  //run();
import { useEffect, useState } from "react";

const example = [
  {
    "category": "hypocrisy",
    "claim": "Israel is subject to the world's hypocrisy and double standards",
    "incident": "Israel strikes Hamas leadership hiding in Doha. Foreign leaders who have previousy either done it themselves or approved of such tactics in the past condemn Israel for attacking terror leaders in a foreign country.",
    "incident_id": "",
    "example": "Emmanual Macron, president of France, condemns an Israeli attack on Hamas leadership in Qatar, when under his leadership, France has routinely killed terrorists in foreign lands.",
    "explanation": "Hamas billionaires Khaled Mashal, . The most recent hostage deal was accepted by Israel and rejected by Hamas. On Sept. 8, the day before this attack, Hamas committed a horrific terrorist attack in Jerusalem in which six people were killed and over 50 injured. With this backdrop, Israel decided no longer to give Hamas safe haven in Qatar.",
    "them_tweet_ids": ["1965452213792506048"],
    "us_tweet_ids": ["1965477345634255182"]
  }
];

const tweets = [{
        "created_at": "2025-09-09T011:28:13.000Z",
        "tweet_id": "1965452213792506048",
        "conversation_id": "1965452213792506048",
        "text": "Today's Israeli strikes on Qatar are unacceptable, whatever the reason. I express my solidarity with Qatar and its Emir, Sheikh Tamim Al Thani. Under no circumstances should the war spread throughout the region.",
        "user": {
          "id": "123456789",
          "name": "Emmanuel Macron",
          "screen_name": "EmmanuelMacron",
          "profile_page_url": "https://x.com/EmmanuelMacron",
          "profile_image_url": "https://pbs.twimg.com/profile_images/1550535324501164032/0lTW_4tj_normal.jpg",
          "verified": true,
          "verified_type": "government"
        },
        "image_urls": [],
        "thread_arr": [],
        "video": false,
        "tweet_url": "https://x.com/EmmanuelMacron/status/1965452213792506048",
        "quoted": false,
        "quoted_tweet_data": {
          "user": {}
        },
        "reply": false,
        "in_reply_to_data": {
          "user": {}
        },
        "thread": false,
        "video_html": ""
      },
      {
        "created_at": "2025-09-09T013:08:13.000Z",
        "tweet_id": "1965477345634255182",
        "conversation_id": "1965477345634255182",
        "text": "Never ending hypocrisy and double standards by @EmmanuelMacron and so many others. Never ending lack of concern for the hostages.",
        "user": {
          "id": "XXXXXXXXXXXX",
          "name": "Aizenberg",
          "screen_name": "Aizenberg55",
          "profile_page_url": "https://x.com/Aizenberg55",
          "profile_image_url": "https://pbs.twimg.com/profile_images/1902198662165385216/MpBdg0KV_normal.jpg",
          "verified": true,
          "verified_type": "none"
        },
        "image_urls": [
          {
            "type": "photo",
            "media_key": "3_1749879010014674944",
            "width": 900,
            "url": "https://pbs.twimg.com/media/G0bHOOFXYAAwghH?format=png&name=900x900",
            "height": 900
          }
        ],
        "thread_arr": [],
        "video": false,
        "tweet_url": "https://x.com/Aizenberg55/status/1965477345634255182",
        "quoted": false,
        "quoted_tweet_data": {
          "user": {}
        },
        "reply": false,
        "in_reply_to_data": {
          "user": {}
        },
        "thread": false,
        "video_html": ""
      }
]


export default function Test(props) {
  
  const addToMongo = async () => {
    console.log("add to Mongo");
    const data = await fetch(`http://localhost:5000/addlocally`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // body: JSON.stringify({ example, tweets })
    });

    const importedJson = await data.json();

  }
  
  
  return (
    <div className="tweetMainWrapper">
      <button onClick={addToMongo}>Add To Mongo</button>
    </div>
  )
}


/*
    

*/
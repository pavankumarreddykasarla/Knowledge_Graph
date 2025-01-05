// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';
// import { PopupComponent } from '../popup/popup.component';

// interface Message {
//   sender: 'bot' | 'user';
//   text?: string;
//   conversationalResponse?: string;
//   cypherQuery?: string;
//   queryResult?: string ;
// }

// @Component({
//   selector: 'app-chatbot',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './chatbot.component.html',
//   styleUrls: ['./chatbot.component.css'],
// })
// export class ChatbotComponent {
//   @ViewChild('messagesContainer') messagesContainer!: ElementRef;

//   messages: Message[] = [];
//   userInput: string = '';

//   constructor(private dialog: MatDialog) {
//     this.addBotMessage(
//       'Hello! I am your assistant bot. How can I help you today?',
//       '', // conversationalResponse
//       '', // cypherQuery
//       ''  // queryResult
//     );
//   }


//   sendMessage() {
//     if (this.userInput.trim()) {
//       this.messages.push({ sender: 'user', text: this.userInput });
//       this.generateBotResponse(this.userInput);
//       this.userInput = '';
//     }
//   }

//   // generateBotResponse(userMessage: string) {
//   //   fetch('http://localhost:3000/api/question', {
//   //     method: 'POST',
//   //     headers: {
//   //       'Content-Type': 'application/json',
//   //     },
//   //     body: JSON.stringify({ question: userMessage }),
//   //   })
//   //     .then((response) => response.json())
//   //     .then((data) => {
//   //       console.log('API response:', data);
//   //       const botResponse: Message = {
//   //         sender: 'bot',
//   //         text: data.conversationalResponse || 'I am not sure how to respond to that.',
//   //         conversationalResponse: data.conversationalResponse || 'No response available',
//   //         cypherQuery: data.cypherQuery || 'No query available',
//   //         queryResult: data.queryResult ? JSON.stringify(data.queryResult[0] || data.queryResult) : 'No result available',

//   //       //   queryResult: JSON.stringify(data.queryResult[0]),
//   //       };
//   //       console.log('Bot response:', botResponse, data.queryResult, data.cypherQuery);

//   //       this.addBotMessage(botResponse.text, botResponse.conversationalResponse);
//   //     })
//   //     .catch((error) => {
//   //       console.error('Error calling API:', error);
//   //       this.addBotMessage('Sorry, I am having trouble responding at the moment.');
//   //     });
//   // }

//   // addBotMessage(text?: string, conversationalResponse?: string) {
//   //   this.messages.push({ sender: 'bot', text, conversationalResponse });
//   //   this.scrollToBottom();
//   // }

//   generateBotResponse(userMessage: string) {
//     fetch('http://localhost:3000/api/question', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ question: userMessage }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('API response:', data);

//         let queryResultFormatted: any[]; // Ensure it's always an array
//         if (Array.isArray(data.queryResult)) {
//           queryResultFormatted = data.queryResult; // If it's an array, use it as-is
//         } else if (data.queryResult && typeof data.queryResult === 'object') {
//           queryResultFormatted = [data.queryResult]; // If it's an object, convert it to an array
//         } else {
//           queryResultFormatted = []; // Fallback to an empty array if queryResult is not available
//         }

//         const botResponse: Message = {
//           sender: 'bot',
//           text: data.conversationalResponse || 'I am not sure how to respond to that.',
//           conversationalResponse: data.conversationalResponse || 'No response available',
//           cypherQuery: data.cypherQuery || 'No query available',
//           queryResult: queryResultFormatted, // Ensure queryResult is an array
//         };

//         console.log('Bot response:', botResponse, data.queryResult, data.cypherQuery);

//         // Call addBotMessage with all the necessary fields
//         this.addBotMessage(
//           botResponse.text,
//           botResponse.conversationalResponse,
//           botResponse.cypherQuery,
//           "queryResult"
//         );
//       })
//       .catch((error) => {
//         console.error('Error calling API:', error);
//         this.addBotMessage('Sorry, I am having trouble responding at the moment.');
//       });
//   }

//   addBotMessage(text?: string, conversationalResponse?: string, cypherQuery?: string, queryResult?: any[]) {
//     this.messages.push({
//       sender: 'bot',
//       text,
//       conversationalResponse,
//       cypherQuery,
//       queryResult,
//     });
//     this.scrollToBottom();
//   }



//   scrollToBottom() {
//     setTimeout(() => {
//       if (this.messagesContainer) {
//         this.messagesContainer.nativeElement.scrollTop =
//           this.messagesContainer.nativeElement.scrollHeight;
//       }
//     }, 100);
//   }

// async openPopup(msg: any) {
//   // Destructure the necessary fields from msg
//   console.log('Popup Data:', msg);
//   const { conversationalResponse, cypherQuery = 'No query available', queryResult = [] } = msg;

//   console.log('Popup Data:', { conversationalResponse, cypherQuery, queryResult });

//   // Show the popup initially
//   const dialogRef = this.dialog.open(PopupComponent, {
//     data: { conversationalResponse, cypherQuery, queryResult },
//   });

//   try {
//     // Use fetch with await to send data to the Node.js backend
//     const response = await fetch('http://localhost:3000/api/relations', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         conversationalResponse,
//         cypherQuery,
//         queryResult,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Response from API:', data);

//     // Reopen the popup with the new API response data
//     this.dialog.open(PopupComponent, {
//       data: { conversationalResponse, cypherQuery, queryResult, apiResponse: data },
//     });
//   } catch (error) {
//     console.error('Error from API:', error);

//     // Reopen the popup with the error information
//     this.dialog.open(PopupComponent, {
//       data: { conversationalResponse, cypherQuery, queryResult, error: error },
//     });
//   }

//   dialogRef.afterClosed().subscribe((result) => {
//     console.log('Popup closed', result);
//   });
// }


//   // async openPopup(conversationalResponse: string, cypherQuery: string, queryResult: any[]) {
//   //   console.log('Popup Data:', { conversationalResponse, cypherQuery, queryResult });

//   //   // Show the popup initially
//   //   const dialogRef = this.dialog.open(PopupComponent, {
//   //     data: { conversationalResponse, cypherQuery, queryResult },
//   //   });

//   //   try {
//   //     // Use fetch with await to send data to the Node.js backend
//   //     const response = await fetch('http://localhost:3000/api/relations', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         conversationalResponse,
//   //         cypherQuery,
//   //         queryResult,
//   //       }),
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error(`HTTP error! status: ${response.status}`);
//   //     }

//   //     const data = await response.json();
//   //     console.log('Response from API:', data);

//   //     // Reopen the popup with the new API response data
//   //     this.dialog.open(PopupComponent, {
//   //       data: { conversationalResponse, cypherQuery, queryResult, apiResponse: data },
//   //     });
//   //   } catch (error) {
//   //     console.error('Error from API:', error);

//   //     // Reopen the popup with the error information
//   //     this.dialog.open(PopupComponent, {
//   //       data: { conversationalResponse, cypherQuery, queryResult, error: error },
//   //     });
//   //   }

//   //   dialogRef.afterClosed().subscribe((result) => {
//   //     console.log('Popup closed', result);
//   //   });
//   // }


// }


import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

interface Message {
  sender: 'bot' | 'user';
  text?: string;
  conversationalResponse?: string;
  cypherQuery?: string;
  queryResult?: string;  // Now expecting queryResult as string
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: Message[] = [];
  userInput: string = '';

  constructor(private dialog: MatDialog) {
    this.addBotMessage(
      'Hello! I am your assistant bot. How can I help you today?',
      '', // conversationalResponse
      '', // cypherQuery
      ''  // queryResult as an empty string
    );
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'user', text: this.userInput });
      this.generateBotResponse(this.userInput);
      this.userInput = '';
    }
  }

  generateBotResponse(userMessage: string) {
    fetch('http://localhost:3000/api/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {

        const botResponse: Message = {
          sender: 'bot',
          text: data.conversationalResponse || 'I am not sure how to respond to that.',
          conversationalResponse: data.conversationalResponse || 'No response available',
          cypherQuery: data.cypherQuery || 'No query available',
          queryResult: data.queryResult ? String(data.queryResult) : 'No result available', // Convert queryResult to string
        };

        console.log('Bot response:', botResponse, data.queryResult, data.cypherQuery);

        // Call addBotMessage with all the necessary fields
        this.addBotMessage(
          botResponse.text,
          botResponse.conversationalResponse,
          botResponse.cypherQuery,
          botResponse.queryResult
        );
      })
      .catch((error) => {
        console.error('Error calling API:', error);
        this.addBotMessage('Sorry, I am having trouble responding at the moment.');
      });
  }

  addBotMessage(text?: string, conversationalResponse?: string, cypherQuery?: string, queryResult?: string) {
    this.messages.push({
      sender: 'bot',
      text,
      conversationalResponse,
      cypherQuery,
      queryResult,
    });
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  async openPopup(msg: any) {
    const { conversationalResponse, cypherQuery = 'No query available', queryResult = '' } = msg;

    // Show the popup initially
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { conversationalResponse, cypherQuery, queryResult },
    });

    try {
      // Use fetch with await to send data to the Node.js backend
      const response = await fetch('http://localhost:3000/api/graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationalResponse,
          cypherQuery,
          queryResult,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from API:', data);

      // Reopen the popup with the new API response data
      this.dialog.open(PopupComponent, {
        data: { conversationalResponse, cypherQuery, queryResult, apiResponse: data },
      });
    } catch (error) {
      console.error('Error from API:', error);

      // Reopen the popup with the error information
      this.dialog.open(PopupComponent, {
        data: { conversationalResponse, cypherQuery, queryResult, error: error },
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Popup closed', result);
    });
  }
}

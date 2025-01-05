import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ChatbotComponent } from '../app/chatbot/chatbot.component'; // Import ChatbotComponent
import { NgxChatModule } from 'ngx-chat';
import { MatDialogModule } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ChatbotComponent,
    PopupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxChatModule,
    MatDialogModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

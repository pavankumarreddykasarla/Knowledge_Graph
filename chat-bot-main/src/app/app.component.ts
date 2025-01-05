import { Component } from '@angular/core';
import { ChatbotComponent } from './chatbot/chatbot.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [],
  imports: [ChatbotComponent],
})
export class AppComponent {
  title = 'chatbot-app';
}

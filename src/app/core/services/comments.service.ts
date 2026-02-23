import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URL } from '../../../environments/environment';
import { Comments } from '../model/comments.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  baseUrl = API_URL;

  requestOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  }

  textResponse = {
    responseType: 'text' as 'json'
  }
  constructor(private http: HttpClient) { }

  // Function to send comment to the backend
  addComment(payload: any) {
    return this.http.post(this.baseUrl + "/comments/saveComments", payload, this.textResponse);
  }

  getAllCommentsByMemberId(memberId: string) {
    return this.http.get<Comments[]>(this.baseUrl + `/comments/getComments/${memberId}`).pipe(
    map(data => data.map(this.mapCommentDtoToComment.bind(this)))
  );
  }

  mapCommentDtoToComment(data): Comments {
    return {
      id: data.id,
      authorName: data.nameRgstrnRqstCmntUser,
      authorRole: data.rgstrnRqstCmntRole,
      comments: data.textRgstrnRqstCmnt,
      createdAt: new Date(data.timestamp),
      memberId: data.memberId,
      isDeleted: false
    };
  }

}

import {ChangeDetectorRef, Injectable} from '@angular/core';
import {Post} from './post.model';
import {Comment} from './comment.model';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class PostService {
  public apiUrl = environment.baseApiUrl + '/posts';
  private posts: Post[] = [];

  constructor(private http: HttpClient) {
  }

  getPosts(term?: any): Observable<any> {
    const params = this.getParams(term);
    return this.http.get(`${this.apiUrl}`, {params});
  }

  getPostsStream(cd: ChangeDetectorRef, url = `${this.apiUrl}`): Observable<Array<Post>> {
    return new Observable((observer) => {
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        console.debug('Received event: ', event);
        const post: Post = this.parsePostFromEvent(event);
        this.posts.push(post);
        cd.detectChanges();
        observer.next(this.posts);
      };
      eventSource.onerror = (error) => {
        if (eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    });
  }

  private parsePostFromEvent(event) {
    let json = JSON.parse(event.data);

    return {
      title: json['title'],
      content: json['content']
    } as Post;
  }

  getPost(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  savePost(data: Post): Observable<any> {
    console.log('saving post:' + data);
    return this.http.post(`${this.apiUrl}`, data);
  }

  updatePost(id: string, data: Post): Observable<any> {
    console.log('updating post:' + data);
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deletePost(id: string): Observable<any> {
    console.log('delete post by id:' + id);
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  saveComment(id: string, data: Comment): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/comments`, data);
  }

  getCommentsOfPost(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/comments`);
  }

  private getParams(term: any) {
    const params: HttpParams = new HttpParams();
    if (term) {
      Object.keys(term).map(key => {
        if (term[key]) {
          params.set(key, term[key]);
        }
      });
    }
    return params;
  }
}

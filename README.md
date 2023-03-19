# Kkiri Delivery Server

### API 작업 방향

1. **DB 설계 및 Entity 정의**  
   \- Entity정의 시 Relation Property에는 Swagger와 관련된 데코레이터 작성 X  
    => 어차피 dto정의 시 필요한 프로퍼티만 pick해서 재정의 해야하기 때문
2. **Logger 미들웨어** 및 **Exception Filter** 등 적용
3. **DTO 정의**: 입력(body,query,param)으로 무엇을 받고, 응답으로 무엇을 반환해야 하는지 먼저 정의
4. **비지니스 로직 작성**: DTO를 기반으로 로직 작성
5. **Swagger**와 **Postman**의 응답을 비교

---

- **Database**

  - 1:1 관계의 테이블은 생성될 때, 같이 생성되어야 한다.  
    ex) 회원 - 장바구니 => 회원 가입 시 장바구니도 동시에 생성되어야 함

- **TypeOrm**

  - relation key: foreign key
  - **foreign key**를 갖는 엔티티에서는 @Column()을 이용하여 foreign key를 명시
    - foreign key를 명시하지 않으면 foreign key만을 가져올 수 없음
  - **OneToOne Relation** : @JoinColumn()이 쓰인 쪽에서 foreign key를 갖음
  - **OneToMany & ManyToOne**: @OneToMany()는 필수 X, @ManyToOne()만 필수
  - **find 메소드**:

    - join(relation)할 테이블을 select할 때, join할 테이블의 primary key인 id를 제외하면 불분명하게 동작

  - **Local Time Issue**: **timezone: 'Z'** 를 명시해야 함. 로컬타임이 기본 값이라는데 개소리
  - **MySql에서는 1us의 단위**로 시간을 갖음. 그러나 이를 **자바스크립트의 Date객체는 1ms단위**를 갖기 때문에 **시간의 오차가 존재**함.  
     따라서 Ascending Order로 정렬한 후 More Than(Greater Than)으로 데이터를 가져오려고 하면 자신의 데이터를 포함하는 이슈가 생김.  
     Descending Order로 정렬하더라도 0.1ms 미만의 차이가 난다면 문제가 발생할 수 있음.
    > **Junction Table(JoinTable)의 Entity를 직접 정의했을 때, 서버 재시작시 발생하는 에러**
    >
    > - Junction Table의 Priamry Column의 타입은 FK이면서 PK인데, FK의 타입과 정확히 일치해야 함.  
    >   ex) VARCHAR(255) - VARCHAR(36) 과 같이 length가 달라도 문제가 발생
    > - inverse side가 양쪽 모두 적혀있고, @JoinTable을 번갈아 가면서 한 쪽은 제거하고 다른 한 쪽에 추가해보면서 확인해보면 에러가 나는 경우가 있음
    >   => _inverse side를 모두 제거하고, @JoinTable을 양측에서 번갈아가면서 제거하고 추가해보면서 확인_
    > - 이유를 알 수가 없음
    > - **Inverse Side**: Many-to-Many 정의 시 @JoinTable을 한 쪽에서만 정의해야 하는데, @JoinTable을 적은 테이블에서만 join이 가능함  
    >   ex) Order - Restaurant 의 관계(m:n)에서 Order Entity에서 @JoinTable을 적었다면, order테이블에서만 join 가능. 만약 Restaurant Entity에서 @JoinTable을 적었다면 에러 발생  
    >   => 양측 모두에서 join이 가능하게 하려면 @ManyToMany의 두 번째 파라미터에 inverse side에서 서로 참조하도록 설정하면 됨

---

- **Swagger**

  - 입력(body, query, param)에서 class-validator 빠뜨리지 말 것
  - **Generic Schema**: *Raw Definitions*를 이용
    - **@ApiExtraModels**: 직접적으로 참조할 수 없는 모델을 정의
    - _oneOf_, _anyOf_, _allOf_: 모델을 조합하기 위함
      - **oneOf**: 하위 스키마 중 정확히 하나에 대해 값의 유효성을 검사합니다.
      - **anyOf**: (하나 이상의) 하위 스키마에 대해 값의 유효성을 검사합니다.
      - **allOf**: 모든 하위 스키마에 대해 값의 유효성을 검사합니다.  
        다양한 상속 관련 사용 사례를 다루기 위해 OAS 3에서 제공하는 개념
    - **@getSchemaPath**: 모델을 참조하기 위함
    - **@ApiBody**: request body 타입 지정(Method Decorator)
    - **@ApiConsumes**: request body 형식 지정 => @ApiConsumes('multipart/form-data')

- **Javascript**

  - reduce의 기능은 대부분 **for-of**로 iterate(loop)하면 대부분 대체가 가능

- **파일 업로드**

  - 파일 데이터와 함께 다른 데이터를 받아야 하는 경우
  - **form data**는 **@Body**로 받을 수 있음

  > 1. 파일업로드를 하려는 모듈에서 **Multer Module을 임포트**
  > 2. 저장 경로(destination)와 파일 이름(fileName), 용량 제한(limit) 등 설정: **factory 사용**
  > 3. **FileInterceptor**를 이용하여 파일 업로드: @UseInterceptors(FileInterceptor('image'))
  > 4. 업로드 된 파일은 **@UploadedFile()** 파라미터 데코레이터를 이용하여 조회 가능

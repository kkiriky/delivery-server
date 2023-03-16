# Kkiri Delivery Server

- **TypeOrm**

  - relation key: foreign key
  - **foreign key**를 갖는 엔티티에서는 @Column()을 이용하여 foreign key를 명시
    - 명시하지 않으면 join으로 가져오지 않았을 때, 객체에서 foregin key가 존재하지 않기 때문
  - **OneToOne Relation** : @JoinColumn()이 쓰인 쪽에서 foreign key를 갖음
  - **OneToMany & ManyToOne**: @OneToMany()는 필수 X, @ManyToOne()만 필수
  - **find 메소드**: join할 테이블의 컬럼을 원하는대로 select할 수 없음
    - query builder를 사용하거나,
    - join할 컬럼을 별도로 가져와서 할당(쿼리를 한 번 더 사용)
  - **Local Time Issue**: **timezone: 'Z'** 를 명시해야 함. 로컬타임이 기본 값이라는데 개소리
  - **MySql에서는 1us의 단위**로 시간을 갖음. 그러나 이를 **서버 측으로 가져올 시 1ms단위**로 가져오기 때문에 **시간의 오차가 존재**함.  
    따라서 Ascending Order로 정렬한 후 More Than(Greater Than)으로 데이터를 가져오려고 하면 자신의 데이터를 포함하는 이슈가 생김.  
    Descending Order로 정렬하더라도 0.1ms 미만의 차이가 난다면 문제가 발생할 수 있음.

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

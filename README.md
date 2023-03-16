# Kkiri Delivery Server

- **TypeOrm**
  - relation key: foreign key
  - **foreign key**를 갖는 엔티티에서는 @Column()을 이용하여 foreign key를 명시
    - 명시하지 않으면 join으로 가져오지 않았을 때, 객체에서 foregin key가 존재하지 않기 때문
  - **OneToOne Relation** : @JoinColumn()이 쓰인 쪽에서 foreign key를 갖음
  - **OneToMany & ManyToOne**: @OneToMany()는 필수 X, @ManyToOne()만 필수

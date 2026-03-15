'use client';

import { forwardRef } from 'react';
import { ContractData, COMPANY_LABELS, COMPANY_ADDRESS, COMPANY_REPRESENTATIVE } from '@/lib/types';
import { toWareki } from '@/lib/date-utils';

const baseStyle: React.CSSProperties = {
  fontFamily: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
  fontSize: '14px',
  lineHeight: '2',
  color: '#1a1a1a',
  background: 'white',
  padding: '60px 70px',
  width: '210mm',
  boxSizing: 'border-box',
  overflowWrap: 'break-word',
  wordBreak: 'normal',
};

const titleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  textAlign: 'center',
  textDecoration: 'underline',
  marginBottom: '32px',
  letterSpacing: '4px',
};

const articleStyle: React.CSSProperties = {
  fontWeight: 700,
  marginTop: '24px',
  marginBottom: '4px',
};

const indentStyle: React.CSSProperties = {
  paddingLeft: '2em',
};

const boldStyle: React.CSSProperties = {
  fontWeight: 700,
};

const highlightStyle: React.CSSProperties = {
  color: '#c0392b',
  fontWeight: 700,
};

function SignatureBlock({ data, role }: { data: ContractData; role: '甲' | '乙' }) {
  const isJybFixed = data.type === 'jyb-base' || data.type === 'jyb-individual';
  const companyName = isJybFixed ? COMPANY_LABELS.jyb : COMPANY_LABELS[data.company];
  const rep = isJybFixed ? COMPANY_REPRESENTATIVE.jyb : COMPANY_REPRESENTATIVE[data.company];
  const addr = isJybFixed ? COMPANY_ADDRESS.jyb : COMPANY_ADDRESS[data.company];
  const sealCompany = isJybFixed ? 'jyb' as const : data.company;

  const sealText = sealCompany === 'mcreate'
    ? ['株式会社', 'エム', 'クリエイト']
    : ['一般社団法人', '日本陰陽五行', 'トーンビューティー', '協会'];
  const sealSize = sealCompany === 'mcreate' ? 72 : 80;
  const sealFontSize = sealCompany === 'mcreate' ? '14px' : '11px';
  const sealLineHeight = sealCompany === 'mcreate' ? '20px' : '16px';

  return (
    <div style={{ marginTop: '24px', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        right: '0',
        top: '0',
        width: `${sealSize}px`,
        height: `${sealSize}px`,
        border: '2px solid #c0392b',
        borderRadius: '50%',
        color: '#c0392b',
        fontSize: sealFontSize,
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: sealLineHeight,
        paddingTop: sealCompany === 'mcreate' ? '8px' : '8px',
        fontFamily: '"Noto Sans JP", serif',
        boxSizing: 'border-box',
      }}>
        {sealText.map((line, i) => (
          <span key={i}>{line}{i < sealText.length - 1 && <br />}</span>
        ))}
      </div>
      <p>{role}：{companyName}</p>
      <p style={{ paddingLeft: '2em' }}>{rep.title}　{rep.name}</p>
      <p style={{ paddingLeft: '2em' }}>住所：{addr}</p>
    </div>
  );
}

function ConsultantContract({ data }: { data: ContractData }) {
  const months = data.type === 'consultant-3' ? '3' : '6';
  const warekiStart = toWareki(data.startDate);
  const warekiEnd = toWareki(data.endDate);
  const warekiContract = toWareki(data.contractDate);

  return (
    <div style={baseStyle}>
      <div style={titleStyle}>サービス利用契約書</div>

      <p>
        （利用者）<span style={boldStyle}>{data.clientName}</span>
        （以下「甲」という。）と（提供者）{COMPANY_LABELS[data.company]}（以下「乙」という。）は、後記のサービスにつき、次のとおりサービス利用契約（以下「本契約」という。）を締結する。
      </p>

      <p style={articleStyle}>第１条　（目的）</p>
      <div style={indentStyle}>
        <p>甲は、乙が提供するマーケティング・コンテンツ制作に関するサービス（以下「本件サービス」という。）について利用することを希望し、乙は、甲に対して本件サービスを提供することを承諾したため、本契約を締結する。</p>
      </div>

      <p style={articleStyle}>第２条　（本件サービス内容等）</p>
      <div style={indentStyle}>
        <p>１　乙が提供する本件サービスは以下のとおり。</p>
        <div style={{ paddingLeft: '2em' }}>
          <p>①サービス名：<span style={boldStyle}>顧問サービス（{months}ヶ月間）</span></p>
          <p>②本件サービスの内容等</p>
          <p style={{ paddingLeft: '1em' }}>・マンツーマンセッション（１回６０分）（UTAGEアドバイスやファネルコンサル含む）</p>
          <p style={{ paddingLeft: '1em' }}>・<span style={boldStyle}>{months}ヶ月間</span>のチャットフォロー（資料・ライティングチェック等も含む）</p>
        </div>
        <p>２　甲は、乙に対し、乙の指定による注文書若しくは電子メール等を交付することにより個別の申し込みを行う。</p>
      </div>

      <p style={articleStyle}>第３条　（代金支払）</p>
      <div style={indentStyle}>
        <p>１　本件サービス料金は以下のとおりとする。</p>
        <p style={{ textAlign: 'center', ...boldStyle }}>金{data.amount}円（税込）</p>
        <p>２　甲は、乙に対し、前項の本件サービス料金を申込み日より3日以内に一括して乙の指定する銀行預金口座に振込む方法、又はクレジットカード決済による方法により支払うものとする。</p>
      </div>

      <p style={articleStyle}>第４条　（契約期間）</p>
      <div style={indentStyle}>
        <p>本契約の有効期間は、ご案内時に定めた<span style={highlightStyle}>{months}ヵ月間</span>、<span style={highlightStyle}>{warekiStart}</span>から<span style={highlightStyle}>{warekiEnd}</span>までとする。</p>
      </div>

      <p style={articleStyle}>第５条　（中途解約及び返金）</p>
      <div style={indentStyle}>
        <p>１　甲は、乙より提供される本件サービスが、一定の定員を設けていること、情報としての性質を有することを確認し、乙に帰責事由がある場合を除き、自己における都合のみを理由として、本件サービス開始後に本契約を解約し返金を求めることができないことを承諾する。</p>
        <p>２　甲のサービス料支払いが分割の場合において、甲による無断解約及び分割サービス料の入金が確認できない場合、乙は、甲に対し、一括して本件サービス料残額を請求できるものとし、当該未払サービス料に対し、第１２条の規定が適用されるものとする。</p>
      </div>

      <p style={articleStyle}>第６条　（責任の範囲等）</p>
      <div style={indentStyle}>
        <p>１　本件サービス提供後の効果については、乙は、甲に対し、何ら責任を負担しないものとする。（本件サービスは個人により、その効果は異なり、すべての方が必ずしも現在の状態から改善及び成果を保証されるものではありません。）</p>
      </div>

      <p style={articleStyle}>第７条　（譲渡の禁止）</p>
      <div style={indentStyle}>
        <p>甲及び乙は、相手方の書面による事前の同意なく、本契約上の地位もしくは本契約に基づくいかなる権利又は義務も、第三者に譲渡しもしくは担保の目的に供してはならない。</p>
      </div>

      <p style={articleStyle}>第８条　（個人情報の保護）</p>
      <div style={indentStyle}>
        <p>乙は、本契約の履行に際して知り得た個人情報を法令、官庁の定めるガイドライン及び甲の指示に従い善良な管理者の注意をもって管理し、当事者に対し書面による事前の承諾を得ることなく、本契約の履行以外の目的に利用、第三者への漏洩、開示することはしないものとする。</p>
      </div>

      <p style={articleStyle}>第９条　（著作権）</p>
      <div style={indentStyle}>
        <p>甲は、本件サービスにより、乙から提供されるコンテンツ、その他情報について、私的使用その他法律により明示的に認められる範囲を超えて、乙の許可なく複製・転用することはできないものとする。</p>
      </div>

      <p style={articleStyle}>第１０条　（解除）</p>
      <div style={indentStyle}>
        <p>甲及び乙は、相手方に背信的行為の存在等、本契約を継続することが著しく困難な事情が生じたときは、なんら通知・催告を要さず、ただちにに本契約を解除することができる。なお、この場合でも損害賠償の請求を妨げない。</p>
      </div>

      <p style={articleStyle}>第１１条　（損害賠償責任）</p>
      <div style={indentStyle}>
        <p>１　甲又は乙は、故意又は過失により本契約に違反し、相手方当事者に損害を与えた場合は、直接かつ現実に生じた通常の損害に限り、当該損害を賠償する責めを負うものとする。</p>
        <p>２　前項による乙が本契約違反により負う損害賠償の範囲は本件サービス料の額を上限とする。</p>
      </div>

      <p style={articleStyle}>第１２条　（遅延損害金）</p>
      <div style={indentStyle}>
        <p>前条にかかわらず、甲が本契約に基づく金銭債務の支払いを遅延したときは、乙に対し、支払期日の翌日から支払済みに至るまで、年１４．６％（年３６５日日割計算）の割合による遅延損害金を支払うものとする。</p>
      </div>

      <p style={articleStyle}>第１３条　（不可抗力）</p>
      <div style={indentStyle}>
        <p>本契約の遂行が甲又は乙の責に帰すべからざる事由により不能（一部不能を含む。）及び履行遅滞となった場合に生じた損害については、相互に賠償責任を負わない。</p>
      </div>

      <p style={articleStyle}>第１４条　（反社会的勢力の排除）</p>
      <div style={indentStyle}>
        <p>１　甲及び乙は、自己又は自己の役員が、暴力団、暴力団関係企業、総会屋もしくはこれらに準ずる者又はその構成員（以下「反社会的勢力」という。）に該当しないこと、及び次の各号のいずれにも該当しないことを表明し、かつ将来にわたっても該当しないことを相互に確約する。</p>
        <p style={{ paddingLeft: '1em' }}>①　反社会的勢力に自己の名義を利用させること</p>
        <p style={{ paddingLeft: '1em' }}>②　反社会的勢力が経営を実質的に支配していると認められる関係を有すること</p>
        <p>２　甲又は乙は、前項の一つにでも違反することが判明したときは、何らの催告を要せず、本契約を解除することができる。</p>
        <p>３　本条の規定により本契約が解除された場合には、解除された者は、解除により生じる損害について、その相手方に対し一切の請求を行わない。</p>
      </div>

      <p style={articleStyle}>第１５条　（協議解決）</p>
      <div style={indentStyle}>
        <p>本契約に定めのない事項又は本契約の解釈について疑義が生じたときは、甲乙誠意をもって協議のうえ解決する。</p>
      </div>

      <p style={articleStyle}>第１６条　（合意管轄）</p>
      <div style={indentStyle}>
        <p>甲及び乙は、本契約に関し裁判上の紛争が生じたときは、訴額等に応じ、乙の所在地を管轄する簡易裁判所又は地方裁判所を専属的合意管轄裁判所とすることに合意する。</p>
      </div>

      <div style={{ marginTop: '48px' }}>
        <p>本契約締結の証として、本契約書２通を作成し、甲乙相互に記名・捺印若しくは署名のうえ、各１通を保有することとする。</p>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p>{warekiContract || '令和　　年　　月　　日'}</p>
      </div>

      <div style={{ marginTop: '24px' }}>
        <p>（甲）：{data.clientName || '＿＿＿＿＿＿＿＿＿＿'}</p>
        <p style={{ paddingLeft: '6em' }}>住所：</p>
        <p style={{ paddingLeft: '6em' }}>{data.clientIsCompany ? `${data.clientName}　代表者：` : `氏名：${data.clientName}`}　　　　　　印</p>
      </div>

      <SignatureBlock data={data} role="乙" />
    </div>
  );
}

function LaunchOutsourceContract({ data }: { data: ContractData }) {
  const warekiContract = toWareki(data.contractDate);

  return (
    <div style={baseStyle}>
      <div style={titleStyle}>業務委託契約書</div>

      <p>
        {COMPANY_LABELS[data.company]}（以下「甲」という。）と、<span style={{ borderBottom: '1px solid #333', padding: '0 2em' }}>{data.clientName}</span>（以下「乙」という。）は、甲が受託するローンチ構築業務に関して、以下のとおり業務委託契約（以下「本契約」という。）を締結する。
      </p>

      <p style={articleStyle}>第1条（定義）</p>
      <div style={indentStyle}>
        <p>１　本契約において、以下の用語は次の意味を有するものとする。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>・「本業務」とは、甲が甲の顧客（以下「クライアント」という。）から受託した特定のローンチ構築プロジェクトにおいて、甲が乙に委託する業務をいう。</p>
          <p>・「プロジェクト」とは、甲がクライアントと締結したローンチ構築サービス契約に基づく個別のプロジェクトをいう。</p>
          <p>・「成果物」とは、本業務の遂行により乙が制作するLP、UTAGE設定データ、配信シナリオ、その他の制作物をいう。</p>
          <p>・「UTAGE」とは、クライアントが別途契約するマーケティングオートメーションプラットフォームをいう。</p>
        </div>
      </div>

      <p style={articleStyle}>第2条（業務内容）</p>
      <div style={indentStyle}>
        <p>１　甲は、プロジェクトごとに乙に対して以下の業務の全部または一部を委託するものとする。具体的な業務範囲は、プロジェクトごとに甲が別途指示する。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>・オプトインページ、シナリオ</p>
          <p>・セミナーまたは個別相談LP制作、それにまつわるシナリオ作成</p>
          <p>・商品購入LP制作（簡易版）それにまつわる決済設定</p>
          <p>・UTAGE構築（ファネル設定、フォーム作成、イベント設定、配信設定等）</p>
          <p>・セミナー構成作成、スライド作成</p>
          <p>・メール / LINE配信シナリオの設定（ステップ配信文を含む）</p>
          <p>・オートウェビナー申込ページ・配信ページの構築</p>
          <p>・自動導線の構築・テスト</p>
          <p>・その他甲が指示する構築関連業務</p>
        </div>
        <p>２　乙は、甲が提供するファネル設計書、テキスト原稿、デザインデータ等の指示に基づき、本業務を遂行するものとする。</p>
        <p>３　乙は本業務の遂行にあたり、甲を介することなくクライアントと直接のやりとりを行うことができる。ただし、乙の本業務の範囲・方針に関する意思決定は甲が行うものとし、乙はクライアントとのやりとりの内容を甲に適時共有するものとする。</p>
        <p>４　乙は、甲から請求された場合、本業務の進捗について、口頭または書面により速やかに報告しなければならない。甲が報告方法を指定した場合はそれに従うものとする。</p>
      </div>

      <p style={articleStyle}>第3条（業務の遂行方法）</p>
      <div style={indentStyle}>
        <p>１　乙は、善良なる管理者の注意をもって本業務を遂行するものとする。</p>
        <p>２　甲と乙の連絡手段はChatworkを基本とし、必要に応じてZoom等のオンラインツールを使用するものとする。</p>
        <p>３　乙は、甲が定めるスケジュールに従い、各工程の納期を遵守するものとする。</p>
        <p>４　乙は、本業務の全部または一部を第三者に再委託してはならない。</p>
      </div>

      <p style={articleStyle}>第4条（報酬および支払条件）</p>
      <div style={indentStyle}>
        <p>１　甲は乙に対し、本業務の報酬として、各プロジェクトにおけるクライアントからの入金総額（税別）の42.5%（以下「業務報酬」という。）を支払うものとする。</p>
        <p>２　甲の乙への業務報酬の支払いは、クライアントから甲への入金金額及び入金時期に連動し、以下のタイミングで行うものとする。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>・固定報酬プラン（Plan A / Plan B）の場合</p>
          <p style={{ paddingLeft: '1em' }}>甲がクライアントから各回の入金を受領した月の翌月末日までに、当該入金金額の45%相当額を乙に支払う。</p>
          <p>・成果報酬プラン（Plan C）の場合</p>
          <p style={{ paddingLeft: '1em' }}>着手金入金時：甲がクライアントから着手金を受領した月の翌月末日までに、当該着手金の42.5%相当額を乙に支払う。成果報酬入金時：甲がクライアントから成果報酬を受領した月の翌月末日までに、当該成果報酬の45%相当額を乙に支払う。</p>
        </div>
        <p>３　第1項の報酬の計算基準となる「入金総額」には、申込LPデザイン制作費・ローンチ動画編集費を含むものとし、これらを控除する前の金額を基準とする。</p>
        <p>４　第2項の甲の乙への支払いは銀行振込とし、振込手数料は甲の負担とする。</p>
        <p>５　報酬には消費税を含まないものとし、甲は報酬額に消費税相当額を加算して支払うものとする。</p>
      </div>

      <p style={articleStyle}>第5条（報酬のシミュレーション）</p>
      <div style={indentStyle}>
        <p>１　甲の乙に対する本契約締結時点における各プランの報酬の目安は、以下のとおりとする。ただし、甲のクライアントとの契約金額の変更、制作費その他の必要経費の増減等により、実際の報酬額は変動する場合がある。</p>
        <p>（1）Plan A（契約金額220万円（税込）の場合）</p>
        <p>契約金額（税抜）からデザイン費等の必要経費を控除した残額を按分するものとし、デザイン費が30万円（税抜）の場合の乙の業務報酬の目安は850,000円とする。</p>
      </div>

      <p style={articleStyle}>第6条（品質基準および修正対応義務）</p>
      <div style={indentStyle}>
        <p>１　乙は、本業務の成果物について、甲が定める品質基準を満たすよう制作するものとする。品質基準は甲が別途提示する。</p>
        <p>２　甲またはクライアントから成果物に対して修正指示があった場合、乙は合理的な期間内に無償で修正対応を行うものとする。</p>
        <p>３　成果物の納品後、甲が検収を行い、不具合または品質基準に満たない箇所がある場合、乙は甲の指示に基づき速やかに修正するものとする。修正対応は無償とし、追加報酬は発生しない。ただし、甲またはクライアントの指示変更に起因する大幅な仕様変更については、甲乙協議のうえ追加報酬の有無や金額を決定することができる。</p>
        <p>４　ローンチ実施後からエバーグリーン移行完了までの期間中に発見された構築上の不具合については、乙は無償で修正対応を行うものとする。</p>
      </div>

      <p style={articleStyle}>第7条（知的財産権）</p>
      <div style={indentStyle}>
        <p>１　本業務により乙が制作した成果物の著作権（著作権法第27条および第28条に定める権利を含む。）は、甲に帰属するものとする。</p>
        <p>２　乙は、前項の成果物についての著作者人格権を行使しないものとする。</p>
        <p>３　甲が本業務のために乙に提供するファネル設計書、テンプレート、ノウハウ、フレームワーク等の知的財産は、甲に帰属するものとし、乙はこれを本業務以外の目的で使用してはならない。</p>
      </div>

      <p style={articleStyle}>第8条（秘密保持）</p>
      <div style={indentStyle}>
        <p>１　甲および乙は、本契約の履行に関連して知り得た相手方の技術上、営業上その他の秘密情報（以下「秘密情報」という。）を、相手方の事前の書面による承諾なく第三者に開示・漏洩してはならない。</p>
        <p>２　前項の秘密情報には、以下を含むものとする。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>・クライアントに関する情報（名称、事業内容、売上、顧客リスト等）</p>
          <p>・甲のファネル設計書、マーケティング戦略、ノウハウ、フレームワーク</p>
          <p>・甲の報酬体系、クライアントとの契約条件</p>
          <p>・本業務の遂行過程で取得した個人情報</p>
          <p>・本契約の内容（報酬率を含む）</p>
        </div>
        <p>３　秘密保持義務は、本契約の終了後3年間存続するものとする。</p>
      </div>

      <p style={articleStyle}>第9条（クライアントへの直接営業の禁止）</p>
      <div style={indentStyle}>
        <p>１　乙は、本契約の有効期間中および本契約終了後2年間、甲のクライアント（甲を通じて乙が業務を行ったクライアントに限る。）に対して、甲を介さず直接に営業行為を行い、また甲と競合するサービスを提供してはならない。</p>
        <p>２　乙は、クライアントから直接業務の依頼や相談を受けた場合は、速やかに甲に報告するものとする。</p>
        <p>３　乙が本条に違反した場合、甲は乙に対し、甲が当該クライアントから得た報酬の全額に相当する違約金を請求することができる。この場合、甲が被った損害がこれを超えるときは、超過分についても賠償請求することができる。</p>
      </div>

      <p style={articleStyle}>第10条（個人情報の取扱い）</p>
      <div style={indentStyle}>
        <p>１　乙は、本業務の遂行にあたりクライアントの顧客情報等の個人情報を取り扱う場合、個人情報の保護に関する法律その他関連法令を遵守し、適切に管理するものとする。</p>
        <p>２　乙は、本業務終了後、甲の指示に基づき、保有する個人情報を速やかに返却または削除するものとする。</p>
      </div>

      <p style={articleStyle}>第11条（契約期間）</p>
      <div style={indentStyle}>
        <p>１　本契約の有効期間は、本契約締結日から1年間とする。</p>
        <p>２　本契約は、期間満了の1ヶ月前までに甲または乙から書面による解約の申し出がない限り、同一条件で1年間自動更新されるものとし、以降も同様とする。</p>
        <p>３　各プロジェクトの業務期間は、甲が乙に業務を発注した時点から、当該プロジェクトのエバーグリーン移行完了（Plan Aの場合はローンチ完了）までとする。</p>
      </div>

      <p style={articleStyle}>第12条（契約の解除）</p>
      <div style={indentStyle}>
        <p>１　甲または乙は、相手方が以下のいずれかに該当した場合、書面による通知をもって本契約を直ちに解除することができる。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>・本契約の条項に違反し、相当の期間を定めて催告したにもかかわらず是正しなかったとき</p>
          <p>・相手方の信用を著しく毀損する行為を行ったとき</p>
          <p>・支払停止、破産、民事再生その他の法的倒産手続の申立てがあったとき</p>
          <p>・第9条（クライアントへの直接営業の禁止）に違反したとき</p>
        </div>
        <p>２　甲は、進行中のプロジェクトがない場合に限り、1ヶ月前の書面通知により本契約を中途解約することができる。</p>
        <p>３　進行中のプロジェクトがある状態で本契約が終了する場合、当該プロジェクトに関する業務については、プロジェクト完了まで本契約の規定が適用されるものとする。</p>
      </div>

      <p style={articleStyle}>第13条（反社会的勢力の排除）</p>
      <div style={indentStyle}>
        <p>甲および乙は、自己およびその役員が、反社会的勢力（暴力団、暴力団員、暴力団準構成員、暴力団関係企業、総会屋その他これらに準ずる者をいう。）に該当しないこと、および反社会的勢力と関係を有しないことを表明し保証する。</p>
      </div>

      <p style={articleStyle}>第14条（合意管轄）</p>
      <div style={indentStyle}>
        <p>本契約に関する紛争については、甲の本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とする。</p>
      </div>

      <p style={articleStyle}>第15条（協議）</p>
      <div style={indentStyle}>
        <p>本契約に定めのない事項については、甲乙誠意をもって協議のうえ解決するものとする。</p>
      </div>

      <div style={{ marginTop: '48px' }}>
        <p>本契約の締結を証するため、本書2通を作成し、甲乙記名押印のうえ、各自1通を保有する。</p>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p>契約締結日：{warekiContract || '令和　　年　　月　　日'}</p>
      </div>

      <SignatureBlock data={data} role="甲" />

      <div style={{ marginTop: '24px' }}>
        <p>乙：{data.clientName || '＿＿＿＿＿＿＿＿＿＿'}</p>
        <p style={{ paddingLeft: '2em' }}>住所：</p>
        <p style={{ paddingLeft: '2em' }}>{data.clientIsCompany ? `${data.clientName}　代表者：` : `氏名：${data.clientName}`}　　　　　　印</p>
      </div>
    </div>
  );
}

function GeneralOutsourceContract({ data }: { data: ContractData }) {
  const warekiStart = toWareki(data.startDate);
  const warekiEnd = toWareki(data.endDate);

  return (
    <div style={baseStyle}>
      <div style={titleStyle}>業務委託契約書</div>

      <p>
        {COMPANY_LABELS[data.company]}（以下「甲」という）と<span style={boldStyle}>{data.clientName}</span>（以下「乙」という）は、甲が乙に対し、後掲の本件業務を委託することに関し、以下の通り業務委託契約（以下「本契約」という。）を締結する。
      </p>

      <p style={articleStyle}>第１条　（委託業務等）</p>
      <div style={indentStyle}>
        <p>１．　甲は、乙に対し、以下の業務（以下「本委託業務」という）を委託する。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>（1）　甲の指定する業務</p>
          <p>（2）　サービス内容に関しては、以下に定める内容とする。</p>
          <p>（3）　その他これらに関連する一切の業務</p>
        </div>
      </div>

      <p style={articleStyle}>第２条　（委託期間）</p>
      <div style={indentStyle}>
        <p>１．　本委託業務の期間は<span style={highlightStyle}>{warekiStart}</span>よりとする。ただし、契約期限の1週間前までに甲乙双方から特段の意思表示がないときは、自動的に同一条件で契約が更新されるものとする。</p>
      </div>

      <p style={articleStyle}>第３条　（委託料等）</p>
      <div style={indentStyle}>
        <p>１．　甲は、乙に対し、下記に記載するサービス内容の通り、委託料を乙の指定する口座に送金する方法により支払い、送金手数料は甲が負担する。月末締め翌月末払いとする。</p>
      </div>

      <div style={{ marginTop: '16px' }}>
        <p style={boldStyle}>時給：{data.hourlyRate ? `${data.hourlyRate}円（税込）` : '＿＿＿＿＿＿円（税込）'}</p>
      </div>

      <p style={articleStyle}>第４条　（経費負担）</p>
      <div style={indentStyle}>
        <p>本委託業務にかかる費用のうち撮影等における乙の交通費は、甲が負担する。その他の費用が生じた場合は、別途協議する。</p>
      </div>

      <p style={articleStyle}>第５条　（再委託）</p>
      <div style={indentStyle}>
        <p>乙は、本業務を第三者に再委託することができる。この場合、乙は、本契約に基づく乙の義務と同等の義務を再委託先に対して負わせるものとする。甲は、再委託先の責に帰すべき事由により甲に損害が発生した場合であっても、乙に対して、その責任を求めないことをあらかじめ承諾する。</p>
      </div>

      <p style={articleStyle}>第６条　（成果物の権利帰属）</p>
      <div style={indentStyle}>
        <p>本委託業務により制作された成果物に関する著作権（著作権法第27条及び第28条の権利を含む。以下同じ）は、甲に帰属する。</p>
      </div>

      <p style={articleStyle}>第７条　（個人情報の取り扱い）</p>
      <div style={indentStyle}>
        <p>１．　本契約における個人情報とは、本契約の当事者が本契約に関して、相手方に預託した一切の情報のうち、「個人情報の保護に関する法律」（以下「個人情報保護法」という）第2条第1項に定める「個人情報」に該当する情報をいう。</p>
        <p>２．　本契約の当事者は、本業務の遂行に際して個人情報を取り扱う場合には、それぞれ個人情報保護法及び本契約の定めを遵守して、本契約の目的の範囲において個人情報を取り扱うものとし、本契約の目的以外の目的のために、これを取り扱ってはならない。</p>
      </div>

      <p style={articleStyle}>第８条　（秘密保持）</p>
      <div style={indentStyle}>
        <p>１．　甲及び乙は、本件業務の履行に際し相手方より提供を受けた技術上又は営業上その他業務上の情報であり、相手方が媒体（印刷物、フロッピーディスク、光磁気ディスク等）及び手段（口頭、手交、郵送、通信回線による送信等）の如何を問わず、受領した一切の情報（以下「機密情報」という）を、善良なる管理者の注意をもって保持し、本件業務の履行のみに使用するものとし、事前に相手方の書面による承諾のない限り、第三者に開示、提供又は漏洩してはならない。</p>
      </div>

      <p style={articleStyle}>第９条　（報告義務）</p>
      <div style={indentStyle}>
        <p>乙は、甲の求めに応じ、本委託業務に関する情報を遅滞なく報告しなければならない。</p>
      </div>

      <p style={articleStyle}>第１０条　（反社会的勢力排除）</p>
      <div style={indentStyle}>
        <p>１．　甲及び乙は、相手方に対し、自己及び自己の役員等（役員及び実質的に経営に関与している者を含む。以下同じ。）が、現在、暴力団、暴力団員、暴力団員でなくなった時から5年を経過しない者、暴力団準構成員、暴力団関係企業、総会屋等、社会運動等標ぼうゴロ又は特殊知能暴力集団等その他これらに準ずる者（以下これらの者を「暴力団員等」という）に該当しないこと及び次の各号のいずれにも該当しないことを表明し、かつ将来にわたっても該当しないことを確約する。</p>
      </div>

      <div style={{ marginTop: '48px' }}>
        <p>以上、本契約の成立を証するため、本書2通を作成し、甲乙記名押印の上、各1通を保有する。</p>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p>契約締結日：{toWareki(data.contractDate) || '　　年　　月　　日'}</p>
      </div>

      <SignatureBlock data={data} role="甲" />

      <div style={{ marginTop: '24px' }}>
        <p>乙：{data.clientName || '＿＿＿＿＿＿＿＿＿＿'}</p>
        <p style={{ paddingLeft: '2em' }}>住所：</p>
        <p style={{ paddingLeft: '2em' }}>{data.clientIsCompany ? `${data.clientName}　代表者：` : `氏名：${data.clientName}`}　　　　　　印</p>
      </div>
    </div>
  );
}

function LaunchReceiveContract({ data }: { data: ContractData }) {
  const warekiContract = toWareki(data.contractDate);

  return (
    <div style={baseStyle}>
      <div style={titleStyle}>業務委託契約書</div>

      <p>
        <span style={boldStyle}>{data.clientName}</span>（以下「甲」という。）と、{COMPANY_LABELS[data.company]}（以下「乙」という。）は、甲が乙に委託するローンチ構築業務に関して、以下のとおり業務委託契約（以下「本契約」という。）を締結する。
      </p>

      <p style={articleStyle}>第1条（定義）</p>
      <div style={indentStyle}>
        <p>１　本契約において、以下の用語は次の意味を有するものとする。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>・「本業務」とは、甲が乙に委託するローンチ構築プロジェクトに関する業務をいう。</p>
          <p>・「成果物」とは、本業務の遂行により乙が制作するLP、UTAGE設定データ、配信シナリオ、その他の制作物をいう。</p>
          <p>・「UTAGE」とは、甲が別途契約するマーケティングオートメーションプラットフォームをいう。</p>
        </div>
      </div>

      <p style={articleStyle}>第2条（業務内容）</p>
      <div style={indentStyle}>
        <p>１　甲は、乙に対して以下の業務の全部または一部を委託するものとする。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>・オプトインページ、シナリオ</p>
          <p>・セミナーまたは個別相談LP制作、それにまつわるシナリオ作成</p>
          <p>・商品購入LP制作（簡易版）それにまつわる決済設定</p>
          <p>・UTAGE構築（ファネル設定、フォーム作成、イベント設定、配信設定等）</p>
          <p>・セミナー構成作成、スライド作成</p>
          <p>・メール / LINE配信シナリオの設定（ステップ配信文を含む）</p>
          <p>・オートウェビナー申込ページ・配信ページの構築</p>
          <p>・自動導線の構築・テスト</p>
          <p>・その他甲が指示する構築関連業務</p>
        </div>
        <p>２　乙は、甲が提供するファネル設計書、テキスト原稿、デザインデータ等の指示に基づき、本業務を遂行するものとする。</p>
      </div>

      <p style={articleStyle}>第3条（委託料および支払条件）</p>
      <div style={indentStyle}>
        <p>１　甲は乙に対し、本業務の委託料として以下の金額を支払うものとする。</p>
        <p style={{ textAlign: 'center', ...boldStyle }}>金{data.launchFee || '＿＿＿＿＿＿'}円（税込）</p>
        <p>２　支払方法は以下のとおりとする。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>・契約締結後7日以内に委託料の50%を乙の指定する銀行口座に振り込むものとする。</p>
          <p>・残りの50%は、成果物の納品完了後7日以内に乙の指定する銀行口座に振り込むものとする。</p>
        </div>
        <p>３　振込手数料は甲の負担とする。</p>
      </div>

      <p style={articleStyle}>第4条（業務の遂行方法）</p>
      <div style={indentStyle}>
        <p>１　乙は、善良なる管理者の注意をもって本業務を遂行するものとする。</p>
        <p>２　甲と乙の連絡手段はChatworkを基本とし、必要に応じてZoom等のオンラインツールを使用するものとする。</p>
        <p>３　乙は、甲が定めるスケジュールに従い、各工程の納期を遵守するものとする。</p>
      </div>

      <p style={articleStyle}>第5条（品質基準および修正対応義務）</p>
      <div style={indentStyle}>
        <p>１　乙は、本業務の成果物について、甲が定める品質基準を満たすよう制作するものとする。</p>
        <p>２　甲から成果物に対して修正指示があった場合、乙は合理的な期間内に無償で修正対応を行うものとする。</p>
        <p>３　成果物の納品後、甲が検収を行い、不具合または品質基準に満たない箇所がある場合、乙は甲の指示に基づき速やかに修正するものとする。</p>
      </div>

      <p style={articleStyle}>第6条（知的財産権）</p>
      <div style={indentStyle}>
        <p>１　本業務により乙が制作した成果物の著作権（著作権法第27条および第28条に定める権利を含む。）は、甲に帰属するものとする。</p>
        <p>２　乙は、前項の成果物についての著作者人格権を行使しないものとする。</p>
      </div>

      <p style={articleStyle}>第7条（秘密保持）</p>
      <div style={indentStyle}>
        <p>１　甲および乙は、本契約の履行に関連して知り得た相手方の技術上、営業上その他の秘密情報を、相手方の事前の書面による承諾なく第三者に開示・漏洩してはならない。</p>
        <p>２　秘密保持義務は、本契約の終了後3年間存続するものとする。</p>
      </div>

      <p style={articleStyle}>第8条（個人情報の取扱い）</p>
      <div style={indentStyle}>
        <p>乙は、本業務の遂行にあたり個人情報を取り扱う場合、個人情報の保護に関する法律その他関連法令を遵守し、適切に管理するものとする。</p>
      </div>

      <p style={articleStyle}>第9条（契約期間）</p>
      <div style={indentStyle}>
        <p>本契約の有効期間は、本契約締結日から成果物の納品および検収完了までとする。</p>
      </div>

      <p style={articleStyle}>第10条（契約の解除）</p>
      <div style={indentStyle}>
        <p>甲または乙は、相手方が本契約の条項に違反し、相当の期間を定めて催告したにもかかわらず是正しなかったときは、本契約を解除することができる。</p>
      </div>

      <p style={articleStyle}>第11条（反社会的勢力の排除）</p>
      <div style={indentStyle}>
        <p>甲および乙は、自己およびその役員が、反社会的勢力に該当しないこと、および反社会的勢力と関係を有しないことを表明し保証する。</p>
      </div>

      <p style={articleStyle}>第12条（合意管轄）</p>
      <div style={indentStyle}>
        <p>本契約に関する紛争については、乙の本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とする。</p>
      </div>

      <p style={articleStyle}>第13条（協議）</p>
      <div style={indentStyle}>
        <p>本契約に定めのない事項については、甲乙誠意をもって協議のうえ解決するものとする。</p>
      </div>

      <div style={{ marginTop: '48px' }}>
        <p>本契約の締結を証するため、本書2通を作成し、甲乙記名押印のうえ、各自1通を保有する。</p>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p>契約締結日：{warekiContract || '令和　　年　　月　　日'}</p>
      </div>

      <div style={{ marginTop: '24px' }}>
        <p>甲：{data.clientName || '＿＿＿＿＿＿＿＿＿＿'}</p>
        <p style={{ paddingLeft: '2em' }}>住所：</p>
        <p style={{ paddingLeft: '2em' }}>{data.clientIsCompany ? `${data.clientName}　代表者：` : `氏名：${data.clientName}`}　　　　　　印</p>
      </div>

      <SignatureBlock data={data} role="乙" />
    </div>
  );
}

function JybBaseContract({ data }: { data: ContractData }) {
  const warekiContract = toWareki(data.contractDate);
  const warekiStart = toWareki(data.startDate);
  const warekiEnd = toWareki(data.endDate);

  return (
    <div style={baseStyle}>
      <div style={titleStyle}>業務委託基本契約書</div>

      <p>
        一般社団法人 日本陰陽五行トーンビューティー協会（以下「甲」という）と<span style={boldStyle}>{data.clientName}</span>（以下「乙」という）は、甲が乙に対し業務を委託することに関し、以下の通り業務委託基本契約（以下「本契約」という。）を締結する。
      </p>

      <p style={articleStyle}>第１条（目的）</p>
      <div style={indentStyle}>
        <p>本契約は、甲が乙に対して委託する業務に関する基本的な事項を定めることを目的とする。</p>
      </div>

      <p style={articleStyle}>第２条（委託業務）</p>
      <div style={indentStyle}>
        <p>１．　甲は、乙に対し、甲の事業に関連する以下の業務（以下「本業務」という）を委託し、乙はこれを受託する。</p>
        <div style={{ paddingLeft: '1em' }}>
          <p>（1）甲が提供するサービスに関するカウンセリング業務</p>
          <p>（2）甲が提供するサービスに関するサポート業務</p>
          <p>（3）その他甲乙間で別途合意した業務</p>
        </div>
        <p>２．　個別の業務内容、報酬、期間等の詳細は、個別契約において定めるものとする。</p>
      </div>

      <p style={articleStyle}>第３条（個別契約）</p>
      <div style={indentStyle}>
        <p>１．　甲および乙は、本契約に基づき、個別の業務について個別契約を締結するものとする。</p>
        <p>２．　個別契約において本契約と異なる定めがある場合は、個別契約の定めが優先する。</p>
      </div>

      <p style={articleStyle}>第４条（業務遂行）</p>
      <div style={indentStyle}>
        <p>１．　乙は、善良なる管理者の注意をもって本業務を遂行するものとする。</p>
        <p>２．　乙は、甲の指示に従い、誠実に業務を遂行するものとする。</p>
        <p>３．　乙は、本業務の遂行にあたり、甲のブランドイメージおよび信用を損なわないよう配慮するものとする。</p>
      </div>

      <p style={articleStyle}>第５条（報酬）</p>
      <div style={indentStyle}>
        <p>１．　甲は、乙に対し、個別契約に定める報酬を支払うものとする。</p>
        <p>２．　報酬の支払方法および支払時期は、個別契約において定めるものとする。</p>
      </div>

      <p style={articleStyle}>第６条（秘密保持）</p>
      <div style={indentStyle}>
        <p>１．　甲および乙は、本契約および個別契約の履行に関連して知り得た相手方の技術上、営業上その他業務上の秘密情報を、相手方の事前の書面による承諾なく第三者に開示・漏洩してはならない。</p>
        <p>２．　前項の秘密保持義務は、本契約終了後も3年間存続するものとする。</p>
      </div>

      <p style={articleStyle}>第７条（個人情報の取扱い）</p>
      <div style={indentStyle}>
        <p>乙は、本業務の遂行にあたり個人情報を取り扱う場合、個人情報の保護に関する法律その他関連法令を遵守し、適切に管理するものとする。</p>
      </div>

      <p style={articleStyle}>第８条（知的財産権）</p>
      <div style={indentStyle}>
        <p>１．　本業務により生じた成果物の著作権その他の知的財産権は、甲に帰属するものとする。</p>
        <p>２．　乙は、甲が提供するテキスト、教材、メソッド等の知的財産を本業務以外の目的で使用してはならない。</p>
      </div>

      <p style={articleStyle}>第９条（再委託の禁止）</p>
      <div style={indentStyle}>
        <p>乙は、甲の書面による事前の承諾なく、本業務の全部または一部を第三者に再委託してはならない。</p>
      </div>

      <p style={articleStyle}>第１０条（契約期間）</p>
      <div style={indentStyle}>
        <p>１．　本契約の有効期間は、<span style={highlightStyle}>{warekiStart}</span>から<span style={highlightStyle}>{warekiEnd}</span>までとする。</p>
        <p>２．　本契約は、期間満了の1ヶ月前までに甲または乙から書面による解約の申し出がない限り、同一条件で1年間自動更新されるものとし、以降も同様とする。</p>
      </div>

      <p style={articleStyle}>第１１条（解除）</p>
      <div style={indentStyle}>
        <p>甲または乙は、相手方が本契約の条項に違反し、相当の期間を定めて催告したにもかかわらず是正しなかったときは、本契約および個別契約を解除することができる。</p>
      </div>

      <p style={articleStyle}>第１２条（損害賠償）</p>
      <div style={indentStyle}>
        <p>甲または乙は、故意または過失により本契約に違反し、相手方に損害を与えた場合は、直接かつ現実に生じた通常の損害に限り賠償する責めを負う。</p>
      </div>

      <p style={articleStyle}>第１３条（反社会的勢力の排除）</p>
      <div style={indentStyle}>
        <p>甲および乙は、自己およびその役員が、反社会的勢力に該当しないこと、および反社会的勢力と関係を有しないことを表明し保証する。</p>
      </div>

      <p style={articleStyle}>第１４条（合意管轄）</p>
      <div style={indentStyle}>
        <p>本契約に関する紛争については、甲の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とする。</p>
      </div>

      <p style={articleStyle}>第１５条（協議）</p>
      <div style={indentStyle}>
        <p>本契約に定めのない事項については、甲乙誠意をもって協議のうえ解決するものとする。</p>
      </div>

      <div style={{ marginTop: '48px' }}>
        <p>本契約の締結を証するため、本書2通を作成し、甲乙記名押印のうえ、各自1通を保有する。</p>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p>契約締結日：{warekiContract || '令和　　年　　月　　日'}</p>
      </div>

      <SignatureBlock data={data} role="甲" />

      <div style={{ marginTop: '24px' }}>
        <p>乙：{data.clientName || '＿＿＿＿＿＿＿＿＿＿'}</p>
        <p style={{ paddingLeft: '2em' }}>住所：</p>
        <p style={{ paddingLeft: '2em' }}>{data.clientIsCompany ? `${data.clientName}　代表者：` : `氏名：${data.clientName}`}　　　　　　印</p>
      </div>
    </div>
  );
}

function JybIndividualContract({ data }: { data: ContractData }) {
  const warekiContract = toWareki(data.contractDate);
  const warekiStart = toWareki(data.startDate);
  const warekiEnd = toWareki(data.endDate);
  const isCounselor = data.jybRole === 'counselor';
  const roleLabel = isCounselor ? 'カウンセラー' : 'サポーター';

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
    marginBottom: '16px',
    fontSize: '13px',
    tableLayout: 'fixed',
  };

  const thStyle: React.CSSProperties = {
    border: '1px solid #333',
    padding: '8px 12px',
    backgroundColor: '#f5f5f5',
    fontWeight: 700,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    width: '20%',
  };

  const tdStyle: React.CSSProperties = {
    border: '1px solid #333',
    padding: '8px 12px',
    textAlign: 'left',
    wordBreak: 'normal',
    overflowWrap: 'break-word',
  };

  return (
    <div style={baseStyle}>
      <div style={titleStyle}>業務委託個別契約書</div>

      <p>
        一般社団法人 日本陰陽五行トーンビューティー協会（以下「甲」という）と<span style={boldStyle}>{data.clientName}</span>（以下「乙」という）は、甲乙間で締結された業務委託基本契約書（以下「基本契約」という）に基づき、以下の通り個別契約を締結する。
      </p>

      <table style={tableStyle}>
        <tbody>
          <tr>
            <th style={thStyle}>業務種別</th>
            <td style={tdStyle}>{roleLabel}業務</td>
          </tr>
          <tr>
            <th style={thStyle}>業務内容</th>
            <td style={tdStyle}>
              {isCounselor ? (
                <>甲が提供するサービスに関するカウンセリング業務<br />（体質診断、カウンセリングセッション等）</>
              ) : (
                <>甲が提供するサービスに関するサポート業務<br />（受講生フォロー、事務サポート等）</>
              )}
            </td>
          </tr>
          <tr>
            <th style={thStyle}>契約期間</th>
            <td style={tdStyle}>
              <span style={highlightStyle}>{warekiStart}</span> 〜 <span style={highlightStyle}>{warekiEnd}</span>
            </td>
          </tr>
          <tr>
            <th style={thStyle}>報酬</th>
            <td style={tdStyle}>
              {isCounselor ? (
                <>１件あたりの報酬は、甲が別途定める報酬表に基づく</>
              ) : (
                <>月額報酬は、甲乙間で別途合意した金額とする</>
              )}
            </td>
          </tr>
          <tr>
            <th style={thStyle}>支払方法</th>
            <td style={tdStyle}>
              月末締め翌月末払い、乙の指定する銀行口座への振込（振込手数料は甲負担）
            </td>
          </tr>
          <tr>
            <th style={thStyle}>業務遂行場所</th>
            <td style={tdStyle}>
              オンライン（Zoom等）を基本とし、必要に応じて甲が指定する場所
            </td>
          </tr>
          <tr>
            <th style={thStyle}>連絡手段</th>
            <td style={tdStyle}>
              LINE・Chatwork等、甲が指定するツール
            </td>
          </tr>
          <tr>
            <th style={thStyle}>更新</th>
            <td style={tdStyle}>
              期間満了の1ヶ月前までに甲または乙から書面による解約の申し出がない限り、同一条件で自動更新する
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ marginTop: '16px' }}>
        上記の他、基本契約の各条項が本個別契約に適用されるものとする。
      </p>

      <div style={{ marginTop: '48px' }}>
        <p>本契約の締結を証するため、本書2通を作成し、甲乙記名押印のうえ、各自1通を保有する。</p>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p>契約締結日：{warekiContract || '令和　　年　　月　　日'}</p>
      </div>

      <SignatureBlock data={data} role="甲" />

      <div style={{ marginTop: '24px' }}>
        <p>乙：{data.clientName || '＿＿＿＿＿＿＿＿＿＿'}</p>
        <p style={{ paddingLeft: '2em' }}>住所：</p>
        <p style={{ paddingLeft: '2em' }}>{data.clientIsCompany ? `${data.clientName}　代表者：` : `氏名：${data.clientName}`}　　　　　　印</p>
      </div>
    </div>
  );
}

const ContractPreview = forwardRef<HTMLDivElement, { data: ContractData }>(
  function ContractPreview({ data }, ref) {
    return (
      <div ref={ref}>
        {(data.type === 'consultant-3' || data.type === 'consultant-6') && (
          <ConsultantContract data={data} />
        )}
        {data.type === 'launch-outsource' && (
          <LaunchOutsourceContract data={data} />
        )}
        {data.type === 'launch-receive' && (
          <LaunchReceiveContract data={data} />
        )}
        {data.type === 'general-outsource' && (
          <GeneralOutsourceContract data={data} />
        )}
        {data.type === 'jyb-base' && (
          <JybBaseContract data={data} />
        )}
        {data.type === 'jyb-individual' && (
          <JybIndividualContract data={data} />
        )}
      </div>
    );
  }
);

export default ContractPreview;

import csv
import uuid
from supabase import create_client, Client
import os

# Initialize Supabase client
supabase: Client = create_client(
    os.environ.get("NEXT_PUBLIC_SUPABASE_URL"),
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
)

# Input text
input_text = """
Comedy & Pranks
Khaby Lame (@khaby.lame)

Topper Guild (@topperguild)

WigoFellas (@wigofellas)

Daniel LaBelle (@daniel.labelle)

Stokes Twins (@stokestwins)

Brent Rivera (@brentrivera)

Hannah Stocking (@hannahstocking)

Marcus and Marcus Dobre (@dobretwins)

Ondreaz Lopez (@ondreazlopez)

Tony Lopez (@tonylopez)

Jonklaasen (@jonklaasen)

Ross Smith (@rosssmith)

Kyle Thomas (@kylethomas)

Jason Coffee (@jasoncoffee)

Q Park (@qpark)

Younes Zarou (@youneszarou)

Naim Darrechi (@naimdarrechi)

Jacob Sartorius (@jacobsartorius)

Noah Beck (@noahbeck)

Lucas and Marcus (@dobretwins)

Dance & Music
Michael Le (@justmaiko)

Spencer X (@spencerx)

Lexi Rivera (@lexibrookerivera)

Loren Gray (@lorengray)

Avani Gregg (@avani)

Kira Kosarin (@kirakosarin)

JoJo Siwa (@itsjojosiwa)

Jannat Zubair Rahmani (@jannat_zubair29)

Awez Darbar (@awezdarbar)

Nisha Guragain (@nishaguragain)

Garima Chaurasia (@gima_ashi)

Piyanka Mongia (@piyanka_mongia)

Jayden Croes (@jaydencroes)

Gilmher Croes (@gilmhercroes)

Lauren Godwin (@laurengodwin)

Mackenzie Ziegler (@mackenzieziegler)

Zoe LaVerne (@zoelaverne)

Camilo (@camilo)

Lele Pons (@lelepons)

Kristen Hancher (@kristenhancher)

Beauty & Lifestyle
James Charles (@jamescharles)

Baby Ariel (@babyariel)

Savannah LaBrant (@savv.labrant)

Danielle Cohn (@daniellecohn)

Avneet Kaur (@avneetkaur)

Liza Koshy (@lizzza)

Salice Rose (@officialsalicerose)

Nikita Dragun (@nikitadragun)

Brooke Monk (@brookemonk_)

Daria Rojas (@darianrojasc)

Malu Trevejo (@malutrevejo)

Madison Beer (@madisonbeer)

Lauren Godwin (@laurengodwin)

Brittany Broski (@brittany_broski)

D'Amelio Family (@dameliofamilyofficial)

Ellie Zeiler (@elliezeiler)

Lexi Hensler (@lexihensler)

Mia Khalifa (@miakhalifa)

Nessa Barrett (@nessaabarrett)

Demi Bagby (@demibagby)

Food & Cooking
Burak Özdemir (@cznburak)

CookingWithShereen (@cookingwithshereen)

Tabitha Brown (@iamtabithabrown)

Jon Kung (@jonkung)

Emily Mariko (@emilymariko)

Foodies (@foodies)

The Korean Vegan (@thekoreanvegan)

Eitan Bernath (@eitan)

Lynja (@lynja)

CookingWithAyeh (@cookingwithayeh)

Animals & Pets
Jiffpom (@jiffpom)

Kody Antle (@kodyantle)

Taco the Corgi (@tacothecorgi)

Noodle the Pug (@showmenoodz)

Tuna the Chiweenie (@tunameltsmyheart)

Crusoe the Dachshund (@crusoe_dachshund)

Juniper the Fox (@juniperfoxx)

Loki the Wolfdog (@loki)

Harlow and Sage (@harlowandsage)

Maya the Samoyed (@mayapolarbear)

Fashion & DIY
Nava Rose (@navarose)

Wisdom Kaye (@wisdomkaye)

Wisdom (@wisdm)

Jordi Koalitic (@jordi.koalitic)

Emma Chamberlain (@emmachamberlain)

Wisdom (@wisdm8)

Bretman Rock (@bretmanrock)

Mikayla Nogueira (@mikaylanogueira)

Draya Michele (@drayamichele)

Wisdom (@wisdom2)

Travel & Adventure
Derek Gerard (@derekgerard)

Louis Cole (@funforlouis)

Kara and Nate (@karaandnate)

The Bucket List Family (@thebucketlistfamily)

Drew Binsky (@drewbinsky)

Lexie Limitless (@lexielimitless)

Kinging-It (@kingingit)

The Planet D (@theplanetd)

Sailing La Vagabonde (@sailinglavagabonde)

Lost LeBlanc (@lostleblanc)

Gaming & Tech
Tyler Blevins (@ninja)

Valkyrae (@valkyrae)

TimTheTatman (@timthetatman)

Pokimane (@pokimanelol)

Corpse Husband (@corpse_husband)

Dream (@dream)

GeorgeNotFound (@georgenotfound)

Sapnap (@sapnap)

Technoblade (@technoblade)

Karl Jacobs (@karljacobs)

Fitness & Wellness
Demi Bagby (@demibagby)

Jen Selter (@jenselter)

Massy Arias (@massy.arias)

Simeon Panda (@simeonpanda)

Kali Burns (@kaliburns)

Natacha Océane (@natacha.oceane)

Whitney Simmons (@whitneyysimmons)

Hannah Bronfman (@hannahbronfman)

Cassey Ho (@blogilates)

Emily Skye (@emilyskyefit)

Education & Science
Hank Green (@hankgreen)

Bill Nye (@billnye)

Neil deGrasse Tyson (@neildegrassetyson)

Mark Rober (@markrober)

Vsauce (@vsauce)

Veritasium (@veritasium)

SmarterEveryDay (@smartereveryday)

Physics Girl (@physicsgirl)

MinutePhysics (@minutephysics)

CrashCourse (@crashcourse)

Art & Creativity
Devon Rodriguez (@devonrodriguezart)

Jazza (@jazza)

Loish (@loishh)

Kesh Art (@keshart)

Draw With Jazza (@drawwithjazza)

Baylee Jae (@bayleejae)

Kasey Golden (@kaseythegolden)

Ross Tran (@rossdraws)

Adam Ming (@artofadam)

Nina Cosford (@ninacosford)

ASMR & Relaxation
Gibi ASMR (@gibiasmr)

ASMR Darling (@asmrdarling)

Gentle Whispering ASMR (@gentlewhispering)

ASMR Glow (@asmrglow)

FrivolousFox ASMR (@frivolousfoxasmr)

ASMR PPOMO (@asmr_ppomo)

Latte ASMR (@latteasmr)

ASMR KittyKlaw (@kittyklawasmr)

ASMR Zeitgeist (@asmrzeitgeist)

Gentle Whispering (@gentlewhispering)

LGBTQ+ Community
Jazz Jennings (@jazzjennings_)

NikkieTutorials (@nikkietutorials)

Bretman Rock (@bretmanrock)

Jeffree Star (@jeffreestar)

Gottmik (@gottmik)

Trixie Mattel (@trixiemattel)

Katya Zamolodchikova (@katya_zamo)

Alaska Thunderfuck (@alaskathunderfuck)

Bob the Drag Queen (@bobthedragqueen)

Kim Chi (@kimchi_chic)

Parenting & Family
The LaBrant Family (@thelabrantfam)

The Bucket List Family (@thebucketlistfamily)

JesssFam (@jesssfam)

Eight Passengers (@eightpassengers)

The Ohana Adventure (@theohanaadventure)

The Shaytards (@shaytards)

Cole and Sav (@coleandsav)

The ACE Family (@theacefamily)

The Ingham Family (@theinghamfamily)

The Stauffer Life (@thestaufferlife)

Finance & Entrepreneurship
Graham Stephan (@grahamstephan)

Meet Kevin (@meetkevin)

Andrei Jikh (@andreijikh)

Myriam Sandler (@tradingwithmyriam)

Rose Han (@rosehan)

Jaspreet Singh (@minoritymindset)

Tai Lopez (@tailopez)

Patrick Bet-David (@patrickbetdavid)

Gary Vaynerchuk (@garyvee)

Alex Hormozi (@hormozi)

Automotive & DIY
ChrisFix (@chrisfixit)

Tavarish (@tavarish)

B is for Build (@bisfordesign)

Rob Dahm (@robdahm)

Hoovie's Garage (@hooviesgarage)

Doug DeMuro (@dougdemuro)

Stradman (@stradman)

Adam LZ (@adamlz)

TJ Hunt (@tj_hunt)

Sarah-n-Tuned (@sarahntuned)

Comedy Skits
Dwayne N Jazz (@dwayneandjazz)

The King Family (@thekingfamilyofficial)

The Holderness Family (@holdernessfamily)

The Williams Family (@thewilliamsfamily)

The Eh Bee Family (@ehbeefamily)

The Beverly Halls (@thebeverlyhalls)

The LaBrant Family (@thelabrantfam)

The Ohana Adventure (@theohanaadventure)

The Ingham Family (@theinghamfamily)

The Stauffer Life (@thestaufferlife)

Fitness Challenges
Chloe Ting (@chloeting)

Pamela Reif (@pamela_rf)

MadFit (@madfit.ig)

Blogilates (@blogilates)

Natacha Océane (@natacha.oceane)

Whitney Simmons (@whitneyysimmons)

Simeon Panda (@simeonpanda)

Kali Burns (@kaliburns)

Emily Skye (@emilyskyefit)

Massy Arias (@massy.arias)

Booktok & Literature
Abby Parker (@abbysbooks)

Emer McLysaght (@emerlysaght)

Cindy Pham (@cindypham)

Ayman Chaudhary (@aymansbooks)

Isabella @bookishthoughts (@bookishthoughts)

Haley Pham (@haleypham)

Jack Edwards (@jackbenedwards)

Celeste Ng (@celesteng)

Jen Campbell (@jenvcampbell)

Reese Witherspoon (@reesesbookclub)

Sustainability & Eco-Friendly
Shelbizleee (@shelbizleee)

Gittemary Johansen (@gittemary)

Immy Lucas (@sustainably_vegan)

Kathryn Kellogg (@going.zero.waste)

Lauren Singer (@trashisfortossers)

Bea Johnson (@zerowastehome)

Rob Greenfield (@robjgreenfield)

Anne-Marie Bonneau (@zerowastechef)

Max La Manna (@maxlamanna)

Isaias Hernandez (@queerbrownvegan)

Mental Health Advocacy
Elyse Myers (@elysemyers)

Dr. Julie Smith (@drjulie)

Kati Morton (@katimorton)

Nedra Tawwab (@nedratawwab)

The Holistic Psychologist (@the.holistic.psychologist)

TherapyJeff (@therapyjeff)

Dr. Jessica Clemons (@askdrjess)

Dr. Nicole LePera (@the.holistic.psychologist)

Lizzo (@lizzo)

Demi Lovato (@ddlovato)

Tech Reviews & Gadgets
Marques Brownlee (@mkbhd)

Unbox Therapy (@unboxtherapy)

Austin Evans (@austinnotduncan)

Jonathan Morrison (@tldtoday)

Sara Dietschy (@saradietschy)

UrAvgConsumer (@uravgconsumer)

Linus Tech Tips (@linustech)

iJustine (@ijustine)

SuperSaf (@supersaf)

Mrwhosetheboss (@mrwhosetheboss)

Travel Vloggers
Drew Binsky (@drewbinsky)

Lexie Limitless (@lexielimitless)

The Bucket List Family (@thebucketlistfamily)

Kara and Nate (@karaandnate)

Lost LeBlanc (@lostleblanc)

Sailing La Vagabonde (@sailinglavagabonde)

Hey Nadine (@heynadine)

The Planet D (@theplanetd)

Kinging-It (@kingingit)

Vagabrothers (@vagabrothers)

Pet Influencers
Jiffpom (@jiffpom)

Tuna the Chiweenie (@tunameltsmyheart)

Noodle the Pug (@showmenoodz)

Loki the Wolfdog (@loki)

Maya the Samoyed (@mayapolarbear)

Crusoe the Dachshund (@crusoe_dachshund)

Juniper the Fox (@juniperfoxx)

Tika the Iggy (@tika_the_iggy)

Marutaro the Shiba (@marutaro)

Doug the Pug (@itsdougthepug)

DIY & Home Improvement
Alexandra Gater (@alexandragater)

Mr. Kate (@mrkate)

Lone Fox (@lonefoxhome)

The Sorry Girls (@thesorrygirls)

Rachel Metz (@rachelmetz)
"""

# Split lines and process data
lines = input_text.split('\n')
influencers = []

for line in lines:
    if "@" in line:  # Only process lines containing an @
        name, account = line.rsplit("(@", 1)
        account = account.strip(")")  # Remove closing bracket
        
        # Create influencer record
        influencer = {
            "id": str(uuid.uuid4()),
            "name": name.strip(),
            "tiktok_profile_link": f"https://www.tiktok.com/@{account.strip()}"
        }
        influencers.append(influencer)

# Insert data into Supabase
try:
    response = supabase.table('influencers').insert(influencers).execute()
    print(f"Successfully added {len(influencers)} influencers to the database")
except Exception as e:
    print(f"Error inserting data into Supabase: {str(e)}")
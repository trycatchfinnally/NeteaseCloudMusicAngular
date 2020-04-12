import { PlayList } from '../DominModel/play-list';
import { Banner } from '../DominModel/banner';
import { Music } from '../DominModel/music';
import { Radio } from '../DominModel/radio';
import { Mv } from '../DominModel/mv';
import { PrivateContent } from '../DominModel/private-content';

export interface PersonalityRecommend {
    recommendList:PlayList[];
    bannerList:Banner[];
    newMusicList:Music[];
    anchorRadioList:Radio[];
    recommendMvList:Mv[];
    privateContentList:PrivateContent[];
}

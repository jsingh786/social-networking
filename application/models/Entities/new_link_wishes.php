<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class new_link_wishes extends \Entities\wishes
{
    /**
     * @ORM\Column(type="integer", length=11, nullable=false)
     */
    private $link_ilook_user_id;
	public function getLink_ilook_user_id() {
		return $this->link_ilook_user_id;
	}

	public function setLink_ilook_user_id($link_ilook_user_id) {
		$this->link_ilook_user_id = $link_ilook_user_id;
	}

}